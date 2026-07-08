import initSqlJs from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

const DB_URL = "/data/articles.db";

let dbPromise;

function loadDb() {
    if (!dbPromise) {
        dbPromise = (async () => {
            const [SQL, buffer] = await Promise.all([
                initSqlJs({ locateFile: () => sqlWasmUrl }),
                fetch(DB_URL).then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch ${DB_URL}`);
                    }
                    return res.arrayBuffer();
                }),
            ]);
            return new SQL.Database(new Uint8Array(buffer));
        })();
    }
    return dbPromise;
}

function runQuery(db, sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
}

// Same validation as the old /api/articles route: topicIndex must be an integer 0-13
function resolveTopicIndex(topicIndex) {
    const index = parseInt(topicIndex, 10);
    return !isNaN(index) && index >= 0 && index <= 13 ? index : null;
}

function resolveFilter(topicIndex, topicThreshold) {
    const index = resolveTopicIndex(topicIndex);
    const threshold = parseFloat(topicThreshold);

    if (index !== null && !isNaN(threshold)) {
        return { index, threshold };
    }
    return null;
}

export async function getArticleCounts(topicIndex, topicThreshold) {
    const db = await loadDb();
    const filter = resolveFilter(topicIndex, topicThreshold);

    const rows = filter
        ? runQuery(
              db,
              `SELECT year, month, COUNT(*) as count
               FROM articles
               WHERE topic_${filter.index} > ?
               GROUP BY year, month
               ORDER BY year, month`,
              [filter.threshold],
          )
        : runQuery(
              db,
              `SELECT year, month, COUNT(*) as count
               FROM articles
               GROUP BY year, month
               ORDER BY year, month`,
          );

    return rows.map((r) => ({
        _id: { year: r.year, month: r.month },
        count: r.count,
    }));
}

export async function getTopicProportions(topicIndex) {
    const db = await loadDb();
    const index = resolveTopicIndex(topicIndex);

    if (index === null) {
        return [];
    }

    const rows = runQuery(
        db,
        `SELECT year, month, AVG(topic_${index}) as proportion, COUNT(*) as count
         FROM articles
         GROUP BY year, month
         ORDER BY year, month`,
    );

    return rows.map((r) => ({
        _id: { year: r.year, month: r.month },
        proportion: r.proportion,
        count: r.count,
    }));
}

export async function getArticleExamples({
    topicIndex,
    topicThreshold,
    skip = 0,
    limit = 10,
    sortField = "date",
    sortDirection = "desc",
    dateFrom,
    dateTo,
}) {
    const db = await loadDb();
    const filter = resolveFilter(topicIndex, topicThreshold);
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const dir = sortDirection === "asc" ? "ASC" : "DESC";

    const conditions = [];
    const params = [];

    if (filter) {
        conditions.push(`topic_${filter.index} > ?`);
        params.push(filter.threshold);
    }
    if (dateFrom && dateTo) {
        conditions.push(`strftime('%Y-%m', pub_date) BETWEEN ? AND ?`);
        params.push(dateFrom, dateTo);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
    const orderBy =
        sortField === "weight" && filter
            ? `topic_${filter.index} ${dir}`
            : `pub_date ${dir}`;
    const topicCol = filter ? `, topic_${filter.index} as topic_val` : "";

    const total = runQuery(
        db,
        `SELECT COUNT(*) as count FROM articles ${whereClause}`,
        params,
    )[0].count;

    const articles = runQuery(
        db,
        `SELECT id, headline, web_url, pub_date${topicCol}
         FROM articles
         ${whereClause}
         ORDER BY ${orderBy}
         LIMIT ? OFFSET ?`,
        [...params, safeLimit, safeSkip],
    ).map((r) => ({
        headline: r.headline,
        web_url: r.web_url,
        pub_date: r.pub_date,
        topicPercentage: filter ? (r.topic_val * 100).toFixed(2) : null,
    }));

    return {
        articles,
        total,
        hasMore: safeSkip + safeLimit < total,
    };
}
