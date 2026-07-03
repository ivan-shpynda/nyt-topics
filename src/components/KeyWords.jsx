import { KEYWORDS } from "@/helpers/constants";
import styles from "./KeyWords.module.css";

export default function KeyWords({ topicIndex }) {
    if (topicIndex === "" || topicIndex === null || topicIndex === undefined) {
        return null;
    }

    const keywords = (KEYWORDS[topicIndex] || "").split(" ").filter(Boolean);

    return (
        <div className={styles.wrapper}>
            <div className={styles.label}>Most Frequent Words</div>
            <div className={styles.tags}>
                {keywords.map((word, i) => (
                    <span key={i} className={styles.tag}>
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
}
