"use client";

import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [topicIndex, setTopicIndex] = useState("");
    const [topicThreshold, setTopicThreshold] = useState("");

    const handleTopicChange = (index) => {
        const wasEmpty = topicIndex === "";
        setTopicIndex(index);

        if (index === "") {
            // Скидаємо threshold тільки при виборі "All topics"
            setTopicThreshold("");
        } else if (wasEmpty) {
            // Встановлюємо дефолтне значення тільки якщо раніше був "All topics"
            setTopicThreshold("50");
        }
        // В інших випадках (переключення між темами) зберігаємо поточне значення
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
