import { createContext, useContext, useState } from "react";
import { MONTH_RANGE } from "@/helpers/constants.js";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [topicIndex, setTopicIndex] = useState("");
    const [topicThreshold, setTopicThreshold] = useState("");
    const [chartMode, setChartMode] = useState("count");
    const [granularity, setGranularity] = useState("month");

    // null = "auto": resolves to "weight" when a topic is selected, else
    // "date". Becomes sticky once the user explicitly picks a sort field.
    const [exampleSortField, setExampleSortField] = useState(null);
    const [exampleSortDirection, setExampleSortDirection] = useState("desc");
    const [exampleDateFrom, setExampleDateFrom] = useState(MONTH_RANGE.from);
    const [exampleDateTo, setExampleDateTo] = useState(MONTH_RANGE.to);

    const handleTopicChange = (index) => {
        setTopicIndex(index);
        if (index === "") {
            setTopicThreshold("");
            setChartMode("count");
            // "weight" sort is meaningless without a topic selected.
            setExampleSortField(null);
        } else if (topicIndex === "") {
            setTopicThreshold("50");
        }
    };

    const effectiveSortField =
        exampleSortField ?? (topicIndex !== "" ? "weight" : "date");

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
                effectiveSortField,
                setExampleSortField,
                exampleSortDirection,
                setExampleSortDirection,
                exampleDateFrom,
                setExampleDateFrom,
                exampleDateTo,
                setExampleDateTo,
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
