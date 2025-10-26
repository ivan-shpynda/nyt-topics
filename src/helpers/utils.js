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

export function processArticleData(articles) {
    const labels = generateMonthLabels();
    const data = new Array(labels.length).fill(0);

    articles.forEach((article) => {
        const { year, month } = article._id;
        const monthIndex =
            (year - DATE_RANGE.START_YEAR) * 12 +
            (month - 1) -
            DATE_RANGE.START_MONTH;

        if (monthIndex >= 0 && monthIndex < data.length) {
            data[monthIndex] = article.count;
        }
    });

    return { labels, data };
}

export function getTotalArticles(articles) {
    return articles.reduce((sum, item) => sum + item.count, 0);
}
