"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { useArticleFilters } from "@/hooks/useArticleFilters";
import { processArticleData } from "@/helpers/utils";
import { getChartData } from "@/helpers/chartConfigs";
import { FilterProvider, useFilters } from "@/context/FilterContext";
import ArticleFilters from "@/components/ArticleFilters";
import ArticleChart from "@/components/ArticleChart";
import ArticleList from "@/components/ArticleList";
import KeyWords from "@/components/KeyWords";
import Footer from "@/components/Footer";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function HomeContent() {
    const {
        articles,
        sampleArticles,
        loading,
        loadingMore,
        hasMore,
        loadMoreArticles,
    } = useArticleFilters();
    const {
        topicIndex,
        setTopicIndex,
        topicThreshold,
        setTopicThreshold,
        resetFilters,
    } = useFilters();

    const { labels: chartLabels, data: chartDataPoints } =
        processArticleData(articles);

    const chartData = getChartData(chartLabels, chartDataPoints);

    return (
        <>
            <div className="container">
                <h1>
                    Mining The New York Times' Coverage <br /> of the Soviet
                    Collapse
                </h1>

                <ArticleFilters
                    topicIndex={topicIndex}
                    setTopicIndex={setTopicIndex}
                    topicThreshold={topicThreshold}
                    setTopicThreshold={setTopicThreshold}
                    articles={articles}
                    onReset={resetFilters}
                />

                <div style={{ marginBottom: "40px" }}>
                    <ArticleChart chartData={chartData} />
                    <KeyWords topicIndex={topicIndex} />
                </div>

                <ArticleList
                    articles={sampleArticles}
                    loading={loading}
                    topicIndex={topicIndex}
                    onLoadMore={loadMoreArticles}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                />
            </div>
            <Footer />
        </>
    );
}

export default function Home() {
    return (
        <FilterProvider>
            <HomeContent />
        </FilterProvider>
    );
}
