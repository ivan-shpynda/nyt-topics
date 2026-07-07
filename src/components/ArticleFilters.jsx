import { useState, useEffect } from "react";
import { TOPICS } from "@/helpers/constants.js";
import { useFilters } from "@/context/FilterContext";
import styles from "./ArticleFilters.module.css";

export default function ArticleFilters({ articles }) {
    const {
        topicIndex,
        setTopicIndex,
        topicThreshold,
        setTopicThreshold,
        chartMode,
        setChartMode,
        granularity,
        setGranularity,
    } = useFilters();
    const [localThreshold, setLocalThreshold] = useState(
        topicThreshold || "50",
    );

    useEffect(() => {
        setLocalThreshold(topicThreshold || "50");
    }, [topicThreshold]);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 900px)");
        const handler = (e) => {
            if (e.matches) setGranularity("year");
        };
        if (mq.matches) setGranularity("year");
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [setGranularity]);

    const totalArticles = articles.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className={styles.wrapper}>
            <div className={styles.topicGroup}>
                <label className={styles.label}>Select Topic</label>
                <select
                    value={topicIndex}
                    onChange={(e) => setTopicIndex(e.target.value)}
                    className={styles.select}
                >
                    <option value="">All topics</option>
                    {TOPICS.map((topic, index) => (
                        <option key={index} value={index}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>

            <div className={`${styles.modeGroup} ${styles.granularityGroup}`}>
                <label className={styles.label}>Granularity</label>
                <div className={styles.modeToggle}>
                    <button
                        type="button"
                        className={`${styles.modeBtn} ${granularity === "month" ? styles.modeBtnActive : ""}`}
                        onClick={() => setGranularity("month")}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        className={`${styles.modeBtn} ${granularity === "year" ? styles.modeBtnActive : ""}`}
                        onClick={() => setGranularity("year")}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {topicIndex !== "" && (
                <div className={`${styles.modeGroup} ${styles.viewGroup}`}>
                    <label className={styles.label}>View</label>
                    <div className={styles.modeToggle}>
                        <button
                            type="button"
                            className={`${styles.modeBtn} ${chartMode === "count" ? styles.modeBtnActive : ""}`}
                            onClick={() => setChartMode("count")}
                        >
                            Article Count
                        </button>
                        <button
                            type="button"
                            className={`${styles.modeBtn} ${chartMode === "proportion" ? styles.modeBtnActive : ""}`}
                            onClick={() => setChartMode("proportion")}
                        >
                            Topic Proportion
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`${styles.thresholdGroup} ${topicIndex !== "" && chartMode === "count" ? "" : styles.hidden}`}
            >
                <label className={styles.label}>
                    Threshold &mdash; {localThreshold}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localThreshold}
                    onChange={(e) => setLocalThreshold(e.target.value)}
                    onMouseUp={(e) => setTopicThreshold(e.target.value)}
                    onTouchEnd={(e) => setTopicThreshold(e.target.value)}
                    className={styles.range}
                    style={{ "--progress": `${localThreshold}%` }}
                />
            </div>

            <div className={styles.count}>
                <div className={styles.countNumber}>
                    {totalArticles.toLocaleString()}
                </div>
                <div className={styles.countLabel}>Articles</div>
            </div>
        </div>
    );
}
