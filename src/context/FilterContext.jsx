import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [topicIndex, setTopicIndex] = useState("");
    const [topicThreshold, setTopicThreshold] = useState("");
    const [chartMode, setChartMode] = useState("count");
    const [granularity, setGranularity] = useState("month");

    const handleTopicChange = (index) => {
        setTopicIndex(index);
        if (index === "") {
            setTopicThreshold("");
            setChartMode("count");
        } else if (topicIndex === "") {
            setTopicThreshold("50");
        }
    };

    return (
        <FilterContext.Provider
            value={{
                topicIndex,
                setTopicIndex: handleTopicChange,
                topicThreshold,
                setTopicThreshold,
                chartMode,
                setChartMode,
                granularity,
                setGranularity,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
}
