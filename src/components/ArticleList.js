"use client";

import { useState } from "react";
import styles from "./ArticleList.module.css";

export default function ArticleList({
    articles,
    loading,
    topicIndex,
    onLoadMore,
    hasMore,
    loadingMore,
}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {`Article examples (${articles?.length || 0})`}
            </h2>
            {loading ? (
                <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                    <p>Loading articles...</p>
                </div>
            ) : (
                <>
                    <div className={styles.articleList}>
                        {articles && articles.length > 0 ? (
                            articles.map((article, index) => (
                                <div key={index} className={styles.articleCard}>
                                    <div className={styles.articleHeader}>
                                        <div className={styles.articleIndex}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.articleInfo}>
                                            <h3 className={styles.headline}>
                                                <a
                                                    href={article.web_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.link}
                                                >
                                                    {article.headline}
                                                </a>
                                            </h3>
                                            <div className={styles.metadata}>
                                                <span className={styles.date}>
                                                    {formatDate(
                                                        article.pub_date
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {article.topicPercentage !== null && (
                                            <span className={styles.percentage}>
                                                {article.topicPercentage}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noArticles}>
                                No articles found
                            </p>
                        )}
                    </div>
                    {hasMore && articles && articles.length > 0 && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                onClick={onLoadMore}
                                className={styles.loadMoreButton}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <div
                                            className={styles.buttonSpinner}
                                        ></div>
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    "Load More Articles"
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
