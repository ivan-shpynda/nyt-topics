import { useState, useEffect } from "react";
import { useFilters } from "@/context/FilterContext";
import { getArticleCounts, getArticleExamples } from "@/lib/sqlite";

export function useArticleFilters() {
    const [articles, setArticles] = useState([]);
    const [sampleArticles, setSampleArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const { topicIndex, topicThreshold } = useFilters();

    useEffect(() => {
        setSkip(0);
        setSampleArticles([]);
        fetchArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicIndex, topicThreshold]);

    const fetchArticles = async () => {
        const adaptedThreshold = topicThreshold
            ? parseFloat(topicThreshold) / 100
            : "";
        // Don't query if a topic is selected but no threshold is specified yet
        if (topicIndex !== "" && adaptedThreshold === "") {
            return;
        }

        try {
            setLoading(true);

            const data = await getArticleCounts(topicIndex, adaptedThreshold);
            setArticles(data);
            // Fetch article examples after chart data is loaded
            await fetchArticleExamples(topicIndex, adaptedThreshold, 0);
        } catch (error) {
            console.error("Error loading articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArticleExamples = async (
        index,
        threshold,
        skipValue = skip,
        append = false,
    ) => {
        try {
            if (append) {
                setLoadingMore(true);
            }

            const data = await getArticleExamples({
                topicIndex: index,
                topicThreshold: threshold,
                skip: skipValue,
                limit: 10,
            });

            if (append) {
                setSampleArticles((prev) => [
                    ...prev,
                    ...(data.articles || []),
                ]);
            } else {
                setSampleArticles(data.articles || []);
            }
            setHasMore(data.hasMore || false);
            setSkip(skipValue + 10);
        } catch (error) {
            console.error("Error loading article examples:", error);
        } finally {
            if (append) {
                setLoadingMore(false);
            }
        }
    };

    const loadMoreArticles = async () => {
        const adaptedThreshold = topicThreshold
            ? parseFloat(topicThreshold) / 100
            : "";
        await fetchArticleExamples(topicIndex, adaptedThreshold, skip, true);
    };

    return {
        articles,
        sampleArticles,
        loading,
        loadingMore,
        hasMore,
        loadMoreArticles,
    };
}
