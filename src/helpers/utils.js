import { MONTH_NAMES, DATE_RANGE } from "@/helpers/constants.js";

export function generateMonthLabels() {
    const labels = [];
    const { START_YEAR, START_MONTH, END_YEAR, END_MONTH } = DATE_RANGE;

    for (let year = START_YEAR; year <= END_YEAR; year++) {
        const start = year === START_YEAR ? START_MONTH : 0;
        const end = year === END_YEAR ? END_MONTH : 11;

        for (let month = start; month <= end; month++) {
            labels.push(`${MONTH_NAMES[month]} ${year}`);
        }
    }

    return labels;
}

// A 0-fill means "no articles that period" for proportion mode vs. "zero
// articles above threshold" for count mode. Currently unreachable in
// practice since every month in DATE_RANGE has real data.
function fillMonthlyData(rows, getValue) {
    const labels = generateMonthLabels();
    const data = new Array(labels.length).fill(0);

    rows.forEach((row) => {
        const { year, month } = row._id;
        const monthIndex =
            (year - DATE_RANGE.START_YEAR) * 12 +
            (month - 1) -
            DATE_RANGE.START_MONTH;

        if (monthIndex >= 0 && monthIndex < data.length) {
            data[monthIndex] = getValue(row);
        }
    });

    return { labels, data };
}

function generateYearLabels() {
    const labels = [];
    for (let year = DATE_RANGE.START_YEAR; year <= DATE_RANGE.END_YEAR; year++) {
        labels.push(String(year));
    }
    return labels;
}

function aggregateYearly(rows, aggregate) {
    const labels = generateYearLabels();
    const data = labels.map((label) => {
        const year = Number(label);
        return aggregate(rows.filter((row) => row._id.year === year));
    });
    return { labels, data };
}

export function processArticleData(articles, granularity = "month") {
    if (granularity === "year") {
        return aggregateYearly(articles, (yearRows) =>
            yearRows.reduce((sum, row) => sum + row.count, 0),
        );
    }
    return fillMonthlyData(articles, (article) => article.count);
}

export function processTopicProportionData(rows, granularity = "month") {
    if (granularity === "year") {
        // Weight each month's proportion by its article count, not a
        // plain average of the 12 monthly percentages, so months with
        // more articles (and partial years at the range's edges) count
        // proportionally. This equals the true AVG(topic_N) across every
        // article in the year.
        return aggregateYearly(rows, (yearRows) => {
            const totalCount = yearRows.reduce((sum, row) => sum + row.count, 0);
            if (totalCount === 0) return 0;
            const weightedSum = yearRows.reduce(
                (sum, row) => sum + row.proportion * row.count,
                0,
            );
            return (weightedSum / totalCount) * 100;
        });
    }
    return fillMonthlyData(rows, (row) => row.proportion * 100);
}

export function getTotalArticles(articles) {
    return articles.reduce((sum, item) => sum + item.count, 0);
}
