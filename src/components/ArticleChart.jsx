import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Tooltip,
    Filler,
} from "chart.js";
import styles from "./ArticleChart.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Tooltip,
    Filler,
);

const ACCENT = "#5B8FD9";
const QUARTERLY = ["Mar", "Jun", "Sep", "Dec"];
const FONT_MONO = "IBM Plex Mono, monospace";

function computeMaxVal(data) {
    const rawMax = Math.max(...data, 1);
    return Math.ceil((rawMax * 1.15) / 5) * 5 || 5;
}

// Chart.js has no built-in crosshair; draw the dashed vertical guide
// through whatever point is currently active (hovered/tooltipped).
const crosshairPlugin = {
    id: "crosshair",
    afterDraw(chart) {
        const active = chart.getActiveElements();
        if (!active.length) return;

        const { ctx, chartArea } = chart;
        const x = active[0].element.x;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = ACCENT;
        ctx.setLineDash([4, 3]);
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.restore();
    },
};

export default function ArticleChart({ labels, data, loading }) {
    const maxVal = useMemo(() => computeMaxVal(data), [data]);

    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    data,
                    borderColor: ACCENT,
                    backgroundColor: `${ACCENT}26`,
                    borderWidth: 2.5,
                    fill: true,
                    cubicInterpolationMode: "monotone",
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: ACCENT,
                    pointHoverBorderColor: "#ffffff",
                    pointHoverBorderWidth: 2,
                },
            ],
        }),
        [labels, data],
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500, easing: "easeOutCubic" },
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: "index",
                    intersect: false,
                    backgroundColor: "#1C1E24",
                    titleColor: "#9BA3AF",
                    titleFont: { family: FONT_MONO, size: 11 },
                    bodyColor: "#ffffff",
                    bodyFont: { family: FONT_MONO, size: 17 },
                    displayColors: false,
                    padding: 14,
                    caretSize: 0,
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (item) => `${item.parsed.y.toLocaleString()} articles`,
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 40,
                        minRotation: 40,
                        color: "#6B7382",
                        font: { family: FONT_MONO, size: 11 },
                        callback(value, index) {
                            const label = labels[index];
                            return QUARTERLY.some((m) => label.startsWith(m)) ? label : "";
                        },
                    },
                },
                y: {
                    min: 0,
                    max: maxVal,
                    grid: { color: "rgba(0,0,0,0.08)" },
                    border: { display: false },
                    ticks: {
                        stepSize: maxVal / 6,
                        color: "#6B7382",
                        font: { family: FONT_MONO, size: 12 },
                        callback: (value) => Math.round(value),
                    },
                },
            },
        }),
        [labels, maxVal],
    );

    if (loading) {
        return (
            <div className={`${styles.card} ${styles.loadingCard}`}>
                <div className={styles.loadingText}>Loading chart…</div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.dateLabel}>
                March 1985 &ndash; December 1991
            </div>
            <div className={styles.chartWrapper}>
                <Line data={chartData} options={options} plugins={[crosshairPlugin]} />
            </div>
        </div>
    );
}
