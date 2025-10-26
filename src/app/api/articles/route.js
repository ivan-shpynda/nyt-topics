import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Article from "@/lib/models/Article";

export async function GET(request) {
    try {
        await connectDB();

        // Отримуємо параметри фільтрації з URL
        const { searchParams } = new URL(request.url);
        const topicIndex = searchParams.get("topicIndex");
        const topicThreshold = searchParams.get("topicThreshold");

        // БудуємоMatch stage для фільтрації
        const matchStage = {};

        if (topicIndex !== null && topicThreshold !== null) {
            const index = parseInt(topicIndex);
            const threshold = parseFloat(topicThreshold);

            // Фільтруємо статті де topics[index] > threshold
            matchStage[`topics.${index}`] = { $gt: threshold };
        }

        // Будуємо aggregation pipeline для графіка
        const pipeline = [];

        // Додаємо match stage якщо є фільтри
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Групуємо по місяцю та року
        pipeline.push({
            $group: {
                _id: { year: "$year", month: "$month" },
                count: { $sum: 1 },
            },
        });

        // Сортуємо
        pipeline.push({
            $sort: { "_id.year": 1, "_id.month": 1 },
        });

        const aggregatedData = await Article.aggregate(pipeline);

        return NextResponse.json({
            success: true,
            data: aggregatedData,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}
