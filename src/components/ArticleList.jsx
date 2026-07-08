import { useFilters } from "@/context/FilterContext";
import { MONTH_RANGE } from "@/helpers/constants.js";
import styles from "./ArticleList.module.css";

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const DIRECTION_LABELS = {
    weight: { desc: "↓ Highest first", asc: "↑ Lowest first" },
    date: { desc: "↓ Newest first", asc: "↑ Oldest first" },
};

export default function ArticleList({
    articles,
    loading,
    onLoadMore,
    hasMore,
    loadingMore,
}) {
    const {
        topicIndex,
        effectiveSortField,
        setExampleSortField,
        exampleSortDirection,
        setExampleSortDirection,
        exampleDateFrom,
        setExampleDateFrom,
        exampleDateTo,
        setExampleDateTo,
    } = useFilters();

    const toggleDirection = () => {
        setExampleSortDirection(exampleSortDirection === "desc" ? "asc" : "desc");
    };

    const handleDateFromChange = (e) => {
        const value = e.target.value;
        setExampleDateFrom(value);
        if (value > exampleDateTo) setExampleDateTo(value);
    };

    const handleDateToChange = (e) => {
        const value = e.target.value;
        setExampleDateTo(value);
        if (value < exampleDateFrom) setExampleDateFrom(value);
    };

    if (loading) return null;

    return (
        <div>
            <div className={styles.eyebrow}>
                Article Examples ({articles?.length || 0})
            </div>

            <div className={styles.controls}>
                {topicIndex !== "" && (
                    <div className={styles.controlGroup}>
                        <label className={styles.label}>Sort by</label>
                        <div className={styles.toggle}>
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${effectiveSortField === "weight" ? styles.toggleBtnActive : ""}`}
                                onClick={() => setExampleSortField("weight")}
                            >
                                Topic Weight
                            </button>
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${effectiveSortField === "date" ? styles.toggleBtnActive : ""}`}
                                onClick={() => setExampleSortField("date")}
                            >
                                Date
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.controlGroup}>
                    <label className={styles.label}>Direction</label>
                    <button
                        type="button"
                        className={styles.directionBtn}
                        onClick={toggleDirection}
                    >
                        {DIRECTION_LABELS[effectiveSortField][exampleSortDirection]}
                    </button>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label}>From</label>
                    <input
                        type="month"
                        className={styles.dateInput}
                        min={MONTH_RANGE.from}
                        max={MONTH_RANGE.to}
                        value={exampleDateFrom}
                        onChange={handleDateFromChange}
                    />
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label}>To</label>
                    <input
                        type="month"
                        className={styles.dateInput}
                        min={MONTH_RANGE.from}
                        max={MONTH_RANGE.to}
                        value={exampleDateTo}
                        onChange={handleDateToChange}
                    />
                </div>
            </div>

            <div className={styles.list}>
                {articles && articles.length > 0 ? (
                    articles.map((article, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.itemIndex}>{index + 1}</div>
                            <div className={styles.itemContent}>
                                <div className={styles.itemHeadline}>
                                    <a
                                        href={article.web_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {article.headline}
                                    </a>
                                </div>
                                <div className={styles.itemDate}>
                                    {formatDate(article.pub_date)}
                                </div>
                            </div>
                            {article.topicPercentage !== null && (
                                <div className={styles.itemBadge}>
                                    {article.topicPercentage}%
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        No articles match these filters. Try widening the
                        threshold or date range.
                    </div>
                )}
            </div>

            {hasMore && articles && articles.length > 0 && (
                <div className={styles.loadMoreWrapper}>
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className={styles.loadMoreBtn}
                    >
                        {loadingMore ? "Loading…" : "Load More Articles"}
                    </button>
                </div>
            )}
        </div>
    );
}
