# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Vite + React 19 single-page app that visualizes topic-model results from a corpus of 18,218 NYT articles about the Soviet collapse (March 1985 – December 1991), produced for a master's thesis. Two routes: `/` (About, static writeup) and `/topics` (interactive Topic Explorer with charts, filters, and article examples).

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # eslint .
```

There is no test suite / test runner configured in this repo.

## Data architecture

There is no backend server or API route — this is a fully static SPA. The article data lives in a SQLite database (`public/data/articles.db`) that is fetched over HTTP at runtime and queried **client-side** via `sql.js` (SQLite compiled to WASM).

- [src/lib/sqlite.js](src/lib/sqlite.js) is the only place that touches the database. It lazily fetches `/data/articles.db`, loads it into an in-memory `sql.js` instance (memoized in `dbPromise` so it only happens once), and exposes three query functions: `getArticleCounts`, `getTopicProportions`, `getArticleExamples`. All SQL lives here — components never write SQL directly.
- The `articles` table has one `topic_N` REAL column (N = 0..13) per LDA topic, holding that topic's probability weight for the article. Filtering "articles about topic N above threshold X" means `WHERE topic_N > X`.
- [scripts/migrate.js](scripts/migrate.js) is a one-time, standalone migration script (MongoDB → SQLite) — it is not part of the app's runtime and is not expected to be re-run. It requires `MONGODB_URI` in `.env.local` and writes to `data/articles.db`; the `public/data/articles.db` the app actually serves is a copy of that file.
- `data/` (top-level) is the working copy of the DB used by the migration script; `public/data/` is the copy actually shipped/fetched by the app. When regenerating data, both need to stay in sync.

## Frontend architecture

- **Filter state** lives in [src/context/FilterContext.jsx](src/context/FilterContext.jsx) (`FilterProvider`/`useFilters`), scoped to the `/topics` page only. It holds `topicIndex`, `topicThreshold`, `chartMode` (`"count"` | `"proportion"`), and `granularity` (`"month"` | `"year"`). Changing topic to "All topics" resets threshold and forces `chartMode` back to `"count"` (proportion mode is meaningless without a topic).
- **Data fetching** lives in [src/hooks/useArticleFilters.js](src/hooks/useArticleFilters.js) (`useArticleFilters`), which re-queries whenever `topicIndex`/`topicThreshold`/`chartMode` change, and separately paginates "article examples" (10 at a time, load-more).
- **Data shaping** for the chart lives in [src/helpers/utils.js](src/helpers/utils.js): raw `{year, month, count}` / `{year, month, proportion}` rows from SQLite are turned into aligned `{labels, data}` arrays against the fixed `DATE_RANGE` (March 1985–December 1991) defined in [src/helpers/constants.js](src/helpers/constants.js). Monthly data fills a full label array so gaps render as zero; yearly data aggregates monthly rows (proportion mode weights each month by its article count, not a plain average, so partial years at the edges are correct).
- `TOPICS` and `KEYWORDS` in [src/helpers/constants.js](src/helpers/constants.js) are static, ordered arrays aligned by index to the `topic_N` DB columns — topic index 0 is `TOPICS[0]`/`topic_0`/`KEYWORDS[0]`.
- Charting uses Chart.js via `react-chartjs-2` in [src/components/ArticleChart.jsx](src/components/ArticleChart.jsx), including a custom crosshair plugin (Chart.js has no built-in one).
- Path alias `@` → `src/` is configured in [vite.config.js](vite.config.js); use `@/...` imports rather than relative paths across directories.
- CSS is per-component CSS Modules (`*.module.css`), not a global stylesheet or CSS-in-JS.

## Deployment

Deployed on Vercel as a static site ([vercel.json](vercel.json)): SPA rewrite of all paths to `index.html`, plus long-lived immutable cache headers for `/data/articles.db` and `/assets/*`. There are no serverless functions.
