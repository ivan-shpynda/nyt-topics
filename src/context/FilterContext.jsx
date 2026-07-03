import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [topicIndex, setTopicIndex] = useState("");
    const [topicThreshold, setTopicThreshold] = useState("");

    const handleTopicChange = (index) => {
        setTopicIndex(index);
        if (index === "") {
            setTopicThreshold("");
        } else if (topicIndex === "") {
            setTopicThreshold("50");
        }
    };

    const resetFilters = () => {
        setTopicIndex("");
        setTopicThreshold("");
    };

    return (
        <FilterContext.Provider
            value={{
                topicIndex,
                setTopicIndex: handleTopicChange,
                topicThreshold,
                setTopicThreshold,
                resetFilters,
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
