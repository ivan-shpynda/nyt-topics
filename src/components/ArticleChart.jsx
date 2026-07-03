import { useState } from "react";
import styles from "./ArticleChart.module.css";

const ACCENT = "#5B8FD9";
const QUARTERLY = ["Mar", "Jun", "Sep", "Dec"];
const SVG_W = 1200;
const SVG_H = 420;
const MARGIN_LEFT = 70;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 60;
const PLOT_W = SVG_W - MARGIN_LEFT - MARGIN_RIGHT;
const PLOT_H = SVG_H - MARGIN_TOP - MARGIN_BOTTOM;

function buildSvgPath(labels, data) {
    const n = data.length;
    if (n < 2) return { pathD: "", areaD: "", gridLines: [], xLabels: [], pts: [] };

    const rawMax = Math.max(...data, 1);
    const maxVal = Math.ceil((rawMax * 1.15) / 5) * 5 || 5;

    const pts = data.map((v, i) => ({
        x: MARGIN_LEFT + (i * PLOT_W) / (n - 1),
        y: MARGIN_TOP + PLOT_H - (v / maxVal) * PLOT_H,
    }));

    let pathD = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    const alpha = 1 / 6;
    for (let i = 0; i < n - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(n - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) * alpha;
        const cp1y = p1.y + (p2.y - p0.y) * alpha;
        const cp2x = p2.x - (p3.x - p1.x) * alpha;
        const cp2y = p2.y - (p3.y - p1.y) * alpha;
        pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const last = pts[n - 1];

    const baseline = MARGIN_TOP + PLOT_H;
    const areaD = `${pathD} L ${last.x.toFixed(1)} ${baseline} L ${pts[0].x.toFixed(1)} ${baseline} Z`;

    const gridLines = [];
    for (let i = 0; i <= 6; i++) {
        const val = Math.round((maxVal / 6) * i);
        const y = MARGIN_TOP + PLOT_H - (val / maxVal) * PLOT_H;
        gridLines.push({ y: y.toFixed(1), label: val });
    }

    const xLabels = labels
        .map((label, i) => ({ label, x: pts[i].x }))
        .filter(({ label }) => QUARTERLY.some((m) => label.startsWith(m)));

    return { pathD, areaD, gridLines, xLabels, pts };
}

function ChartTooltip({ x, y, label, value }) {
    const BOX_W = 176;
    const BOX_H = 60;
    const PAD = 14;
    const PLOT_RIGHT = MARGIN_LEFT + PLOT_W;

    const boxX = x + 18 + BOX_W > PLOT_RIGHT ? x - BOX_W - 18 : x + 18;
    const boxY = Math.max(MARGIN_TOP + 4, Math.min(y - BOX_H / 2, MARGIN_TOP + PLOT_H - BOX_H - 4));

    return (
        <g>
            <line
                x1={x.toFixed(1)}
                x2={x.toFixed(1)}
                y1={MARGIN_TOP}
                y2={MARGIN_TOP + PLOT_H}
                stroke={ACCENT}
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.4"
            />
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="5" fill={ACCENT} />
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5" fill="#ffffff" />
            <rect x={boxX} y={boxY} width={BOX_W} height={BOX_H} fill="#1C1E24" />
            <text
                x={boxX + PAD}
                y={boxY + 22}
                fill="#9BA3AF"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="0.5"
            >
                {label}
            </text>
            <text
                x={boxX + PAD}
                y={boxY + 46}
                fill="#ffffff"
                fontSize="17"
                fontFamily="IBM Plex Mono, monospace"
            >
                {value.toLocaleString()} articles
            </text>
        </g>
    );
}

export default function ArticleChart({ labels, data, loading }) {
    const [tooltip, setTooltip] = useState(null);

    if (loading) {
        return (
            <div className={`${styles.card} ${styles.loadingCard}`}>
                <div className={styles.loadingText}>Loading chart…</div>
            </div>
        );
    }

    const { pathD, areaD, gridLines, xLabels, pts } = buildSvgPath(labels, data);
    const n = data.length;

    const handleMouseMove = (e) => {
        if (!pts.length) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const svgX = (e.clientX - rect.left) * (SVG_W / rect.width);

        if (svgX < MARGIN_LEFT || svgX > MARGIN_LEFT + PLOT_W) {
            setTooltip(null);
            return;
        }

        const i = Math.max(0, Math.min(n - 1, Math.round((svgX - MARGIN_LEFT) * (n - 1) / PLOT_W)));
        setTooltip({ x: pts[i].x, y: pts[i].y, label: labels[i], value: data[i] });
    };

    return (
        <div className={styles.card}>
            <div className={styles.dateLabel}>
                March 1985 &ndash; December 1991
            </div>
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className={styles.svg}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTooltip(null)}
            >
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line
                            x1={MARGIN_LEFT}
                            x2={SVG_W - MARGIN_RIGHT}
                            y1={g.y}
                            y2={g.y}
                            stroke="rgba(0,0,0,0.08)"
                            strokeWidth="1"
                        />
                        <text
                            x={MARGIN_LEFT - 14}
                            y={g.y}
                            fill="#6B7382"
                            fontSize="12"
                            fontFamily="IBM Plex Mono, monospace"
                            textAnchor="end"
                            dominantBaseline="middle"
                        >
                            {g.label}
                        </text>
                    </g>
                ))}
                {pathD && (
                    <path d={areaD} fill={`${ACCENT}26`} stroke="none" />
                )}
                {pathD && (
                    <path d={pathD} fill="none" stroke={ACCENT} strokeWidth="2.5" />
                )}
                {xLabels.map(({ label, x }, i) => (
                    <text
                        key={i}
                        x={x.toFixed(1)}
                        y="404"
                        fill="#6B7382"
                        fontSize="11"
                        fontFamily="IBM Plex Mono, monospace"
                        textAnchor="end"
                        transform={`rotate(-40 ${x.toFixed(1)} 404)`}
                    >
                        {label}
                    </text>
                ))}
                {tooltip && (
                    <ChartTooltip
                        x={tooltip.x}
                        y={tooltip.y}
                        label={tooltip.label}
                        value={tooltip.value}
                    />
                )}
            </svg>
        </div>
    );
}
