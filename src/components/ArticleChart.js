import { Line } from "react-chartjs-2";
import { chartOptions } from "@/helpers/chartConfigs.js";

export default function ArticleChart({ chartData }) {
    return (
        <div style={{ height: "400px", marginBottom: "20px" }}>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}
