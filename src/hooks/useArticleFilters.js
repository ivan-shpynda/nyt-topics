import { useState, useEffect } from "react";
import { useFilters } from "@/context/FilterContext";

export function useArticleFilters() {
    const [articles, setArticles] = useState([]);
    const [sampleArticles, setSampleArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const { topicIndex, topicThreshold } = useFilters();

    useEffect(() => {
        // Reset pagination when filters change
        setSkip(0);
        setSampleArticles([]);
        fetchArticles();
    }, [topicIndex, topicThreshold]);

    const fetchArticles = async () => {
        const adaptedThreshold = topicThreshold
            ? parseFloat(topicThreshold) / 100
            : "";
        // Don't execute request if topic is selected but no threshold is specified
        if (topicIndex !== "" && adaptedThreshold === "") {
            return;
        }

        try {
            setLoading(true);

            let url = "/api/articles";
            const params = new URLSearchParams();

            if (topicIndex !== "" && adaptedThreshold !== "") {
                params.append("topicIndex", topicIndex);
                params.append("topicThreshold", adaptedThreshold);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setArticles(data.data);
                // Fetch article examples after chart data is loaded
                await fetchArticleExamples(params, 0);
            } else {
                console.error("API returned error:", data.error);
            }
        } catch (error) {
            console.error("Error loading articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArticleExamples = async (
        params,
        skipValue = skip,
        append = false
    ) => {
        try {
            if (append) {
                setLoadingMore(true);
            }

            let url = "/api/articles/examples";
            const queryParams = new URLSearchParams(params);
            queryParams.append("skip", skipValue);
            queryParams.append("limit", "10");

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
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
            } else {
                console.error("API returned error:", data.error);
            }
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
        const params = new URLSearchParams();
        if (topicIndex !== "" && adaptedThreshold !== "") {
            params.append("topicIndex", topicIndex);
            params.append("topicThreshold", adaptedThreshold);
        }
        await fetchArticleExamples(params, skip, true);
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
