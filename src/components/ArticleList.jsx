import styles from "./ArticleList.module.css";

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ArticleList({
    articles,
    loading,
    onLoadMore,
    hasMore,
    loadingMore,
}) {
    if (loading) return null;

    return (
        <div>
            <div className={styles.eyebrow}>
                Article Examples ({articles?.length || 0})
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
                        No articles meet this threshold. Try lowering it.
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
