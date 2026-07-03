import { useArticleFilters } from "@/hooks/useArticleFilters";
import { processArticleData } from "@/helpers/utils";
import { FilterProvider, useFilters } from "@/context/FilterContext";
import ArticleFilters from "@/components/ArticleFilters";
import ArticleChart from "@/components/ArticleChart";
import ArticleList from "@/components/ArticleList";
import KeyWords from "@/components/KeyWords";
import styles from "./Topics.module.css";

function ExplorerContent() {
    const {
        articles,
        sampleArticles,
        loading,
        loadingMore,
        hasMore,
        loadMoreArticles,
    } = useArticleFilters();
    const { topicIndex } = useFilters();
    const { labels, data } = processArticleData(articles);

    return (
        <div className={styles.container}>
            <div className={styles.eyebrow}>Topic Explorer</div>
            <h1 className={styles.heading}>
                Coverage of the Soviet Collapse, by Topic
            </h1>
            <p className={styles.meta}>
                March 1985 &ndash; December 1991 &middot; 18,000+ articles
            </p>

            <ArticleFilters articles={articles} />
            <ArticleChart labels={labels} data={data} loading={loading} />
            <KeyWords topicIndex={topicIndex} />
            <ArticleList
                articles={sampleArticles}
                loading={loading}
                onLoadMore={loadMoreArticles}
                hasMore={hasMore}
                loadingMore={loadingMore}
            />
        </div>
    );
}

export default function Topics() {
    return (
        <FilterProvider>
            <ExplorerContent />
        </FilterProvider>
    );
}
