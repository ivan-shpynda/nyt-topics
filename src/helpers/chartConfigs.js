export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: "March 1985 - December 1991",
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Number of Articles",
            },
        },
        x: {
            title: {
                display: true,
                text: "Month/Year",
            },
        },
    },
};

export const getChartData = (labels, dataPoints) => ({
    labels,
    datasets: [
        {
            label: "Articles Published",
            data: dataPoints,
            borderColor: "#5e81ac",
            backgroundColor: "#5e81ac",
            tension: 0.3,
            fill: false,
        },
    ],
});
