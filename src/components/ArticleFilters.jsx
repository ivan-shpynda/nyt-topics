import { useState, useEffect } from "react";
import { TOPICS } from "@/helpers/constants.js";
import { useFilters } from "@/context/FilterContext";
import styles from "./ArticleFilters.module.css";

export default function ArticleFilters({ articles }) {
    const { topicIndex, setTopicIndex, topicThreshold, setTopicThreshold, resetFilters } =
        useFilters();
    const [localThreshold, setLocalThreshold] = useState(topicThreshold || "50");

    useEffect(() => {
        setLocalThreshold(topicThreshold || "50");
    }, [topicThreshold]);

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

            {topicIndex !== "" && (
                <div className={styles.thresholdGroup}>
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
            )}

            <div onClick={resetFilters} className={styles.resetBtn}>
                Reset
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
