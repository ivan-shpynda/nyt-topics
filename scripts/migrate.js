/**
 * One-time migration script: MongoDB → SQLite
 *
 * Usage:
 *   node scripts/migrate.js
 *
 * Requires MONGODB_URI in .env.local (loaded manually below).
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Database from "better-sqlite3";

// ---------------------------------------------------------------------------
// Load .env.local manually (dotenv is removed from deps)
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function loadEnv() {
    try {
        const env = readFileSync(resolve(projectRoot, ".env.local"), "utf8");
        for (const line of env.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed
                .slice(eqIdx + 1)
                .trim()
                .replace(/^["']|["']$/g, "");
            if (!process.env[key]) process.env[key] = val;
        }
    } catch {
        console.error(
            "❌ Could not read .env.local — ensure MONGODB_URI is set",
        );
        process.exit(1);
    }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

// ---------------------------------------------------------------------------
// SQLite setup
// ---------------------------------------------------------------------------
const DB_PATH = resolve(projectRoot, "data/articles.db");
const sqlite = new Database(DB_PATH);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("synchronous = NORMAL");

sqlite.exec(`
    CREATE TABLE IF NOT EXISTS articles (
        id           TEXT PRIMARY KEY,
        headline     TEXT NOT NULL,
        keywords     TEXT,
        news_desk    TEXT,
        pub_date     TEXT NOT NULL,
        section_name TEXT,
        web_url      TEXT NOT NULL,
        day          INTEGER NOT NULL,
        month        INTEGER NOT NULL,
        year         INTEGER NOT NULL,
        topic_0      REAL,
        topic_1      REAL,
        topic_2      REAL,
        topic_3      REAL,
        topic_4      REAL,
        topic_5      REAL,
        topic_6      REAL,
        topic_7      REAL,
        topic_8      REAL,
        topic_9      REAL,
        topic_10     REAL,
        topic_11     REAL,
        topic_12     REAL,
        topic_13     REAL
    );

    CREATE INDEX IF NOT EXISTS idx_year_month ON articles(year, month);
    CREATE INDEX IF NOT EXISTS idx_topic_0  ON articles(topic_0);
    CREATE INDEX IF NOT EXISTS idx_topic_1  ON articles(topic_1);
    CREATE INDEX IF NOT EXISTS idx_topic_2  ON articles(topic_2);
    CREATE INDEX IF NOT EXISTS idx_topic_3  ON articles(topic_3);
    CREATE INDEX IF NOT EXISTS idx_topic_4  ON articles(topic_4);
    CREATE INDEX IF NOT EXISTS idx_topic_5  ON articles(topic_5);
    CREATE INDEX IF NOT EXISTS idx_topic_6  ON articles(topic_6);
    CREATE INDEX IF NOT EXISTS idx_topic_7  ON articles(topic_7);
    CREATE INDEX IF NOT EXISTS idx_topic_8  ON articles(topic_8);
    CREATE INDEX IF NOT EXISTS idx_topic_9  ON articles(topic_9);
    CREATE INDEX IF NOT EXISTS idx_topic_10 ON articles(topic_10);
    CREATE INDEX IF NOT EXISTS idx_topic_11 ON articles(topic_11);
    CREATE INDEX IF NOT EXISTS idx_topic_12 ON articles(topic_12);
    CREATE INDEX IF NOT EXISTS idx_topic_13 ON articles(topic_13);
`);

// ---------------------------------------------------------------------------
// Mongoose Article model (inline, no dependency on src/lib/models)
// ---------------------------------------------------------------------------
const ArticleSchema = new mongoose.Schema(
    {
        _id: { type: String },
        headline: String,
        keywords: [String],
        news_desk: String,
        pub_date: Date,
        section_name: String,
        web_url: String,
        day: Number,
        month: Number,
        year: Number,
        topics: [Number],
    },
    { strict: false },
);

const Article =
    mongoose.models.Article ||
    mongoose.model("Article", ArticleSchema, "articles");

// ---------------------------------------------------------------------------
// Prepared statement for insert
// ---------------------------------------------------------------------------
const insert = sqlite.prepare(`
    INSERT OR REPLACE INTO articles (
        id, headline, keywords, news_desk, pub_date, section_name,
        web_url, day, month, year,
        topic_0, topic_1, topic_2,  topic_3,  topic_4,  topic_5,  topic_6,
        topic_7, topic_8, topic_9, topic_10, topic_11, topic_12, topic_13
    ) VALUES (
        @id, @headline, @keywords, @news_desk, @pub_date, @section_name,
        @web_url, @day, @month, @year,
        @topic_0, @topic_1, @topic_2,  @topic_3,  @topic_4,  @topic_5,  @topic_6,
        @topic_7, @topic_8, @topic_9, @topic_10, @topic_11, @topic_12, @topic_13
    )
`);

const insertBatch = sqlite.transaction((rows) => {
    for (const row of rows) insert.run(row);
});

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------
async function migrate() {
    console.log("🔌 Connecting to MongoDB…");
    await mongoose.connect(MONGODB_URI, {
        dbName: "nyt_data",
        serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected");

    const total = await Article.countDocuments();
    console.log(`📦 Total documents in MongoDB: ${total}`);

    const BATCH_SIZE = 1000;
    let processed = 0;
    let batch = [];

    const cursor = Article.find().lean().cursor();

    for await (const doc of cursor) {
        const topics = doc.topics || [];
        batch.push({
            id: doc._id,
            headline: doc.headline ?? "",
            keywords: JSON.stringify(doc.keywords ?? []),
            news_desk: doc.news_desk ?? null,
            pub_date: doc.pub_date
                ? new Date(doc.pub_date).toISOString()
                : null,
            section_name: doc.section_name ?? null,
            web_url: doc.web_url ?? "",
            day: doc.day ?? 0,
            month: doc.month ?? 0,
            year: doc.year ?? 0,
            topic_0: topics[0] ?? null,
            topic_1: topics[1] ?? null,
            topic_2: topics[2] ?? null,
            topic_3: topics[3] ?? null,
            topic_4: topics[4] ?? null,
            topic_5: topics[5] ?? null,
            topic_6: topics[6] ?? null,
            topic_7: topics[7] ?? null,
            topic_8: topics[8] ?? null,
            topic_9: topics[9] ?? null,
            topic_10: topics[10] ?? null,
            topic_11: topics[11] ?? null,
            topic_12: topics[12] ?? null,
            topic_13: topics[13] ?? null,
        });

        if (batch.length === BATCH_SIZE) {
            insertBatch(batch);
            processed += batch.length;
            batch = [];
            process.stdout.write(`\r  ⏳ ${processed} / ${total}`);
        }
    }

    if (batch.length > 0) {
        insertBatch(batch);
        processed += batch.length;
    }

    console.log(`\r  ✅ Inserted ${processed} / ${total} rows`);

    const sqliteCount = sqlite
        .prepare("SELECT COUNT(*) as count FROM articles")
        .get().count;
    console.log(`📊 SQLite row count: ${sqliteCount}`);

    if (sqliteCount !== total) {
        console.warn(
            `⚠️  Count mismatch! MongoDB: ${total}, SQLite: ${sqliteCount}`,
        );
    } else {
        console.log("✅ Migration complete — counts match");
    }

    await mongoose.disconnect();
    sqlite.close();
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
