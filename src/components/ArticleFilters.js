import { TOPICS } from "@/helpers/constants.js";
import classes from "./ArticleFilters.module.css";
import { useState, useMemo, useEffect } from "react";
import { debounce, set } from "lodash";

export default function ArticleFilters({
    topicIndex,
    setTopicIndex,
    topicThreshold,
    setTopicThreshold,
    onReset,
    articles,
}) {
    const totalArticles = articles.reduce((sum, item) => sum + item.count, 0);

    const [localThreshold, setLocalThreshold] = useState(topicThreshold);

    useEffect(() => {
        setLocalThreshold(topicThreshold);
    }, [topicThreshold]);

    // Create debounced function that updates the parent state
    const debouncedSetThreshold = useMemo(
        () =>
            debounce((value) => {
                // Only update parent if value is valid (not empty and >= 10)
                if (value !== "" && value !== null) {
                    const numValue = +value;
                    if (numValue >= 10) {
                        setTopicThreshold(value);
                    }
                }
            }, 1000),
        [setTopicThreshold]
    );

    const handleThresholdChange = (value) => {
        // Allow empty value or clamp to max 90
        let clampedValue = value;

        if (value !== "" && value !== null) {
            const numValue = +value;
            if (numValue > 90) {
                clampedValue = "90";
            }
        }

        setLocalThreshold(clampedValue);
        debouncedSetThreshold(clampedValue);
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.filtersBlock}>
                <div>
                    <label className={classes.label}>Select Topic:</label>
                    <select
                        className={classes.select}
                        value={topicIndex}
                        onChange={(e) => setTopicIndex(e.target.value)}
                    >
                        <option value="">All topics</option>
                        {TOPICS.map((topic, index) => (
                            <option key={index} value={index}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={classes.label}>Threshold (%):</label>
                    <input
                        type="number"
                        min="10"
                        max="90"
                        step="10"
                        value={localThreshold}
                        onChange={(e) => handleThresholdChange(e.target.value)}
                        placeholder="e.g., 50"
                        className={classes.input}
                        disabled={topicIndex === ""}
                    />
                </div>
                <button
                    className={classes.button}
                    onClick={onReset}
                    disabled={topicIndex === ""}
                >
                    Reset
                </button>
            </div>
            <p className={classes.statsBlock}>
                <span className={classes.statsLabel}>Amount of articles: </span>
                <span className={classes.statsValue}>{totalArticles}</span>
            </p>
        </div>
    );
}
