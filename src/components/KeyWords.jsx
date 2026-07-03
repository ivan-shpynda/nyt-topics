import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { KEYWORDS } from "@/helpers/constants";
import styles from "./KeyWords.module.css";

export default function KeyWords({ topicIndex }) {
    const shouldReduceMotion = useReducedMotion();

    if (topicIndex === "" || topicIndex === null || topicIndex === undefined) {
        return null;
    }

    const keywords = (KEYWORDS[topicIndex] || "").split(" ").filter(Boolean);

    return (
        <div className={styles.wrapper}>
            <div className={styles.label}>Most Frequent Words</div>
            <div className={styles.tags}>
                <AnimatePresence mode="popLayout">
                    {keywords.map((word, i) => (
                        <motion.span
                            key={`${topicIndex}-${word}-${i}`}
                            layout
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.35,
                                ease: "easeOut",
                                delay: shouldReduceMotion ? 0 : Math.min(i * 0.025, 0.3),
                            }}
                            className={styles.tag}
                        >
                            {word}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
