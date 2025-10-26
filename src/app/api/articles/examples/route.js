import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Article from "@/lib/models/Article";

export async function GET(request) {
    try {
        await connectDB();

        // Get filter parameters from URL
        const { searchParams } = new URL(request.url);
        const topicIndex = searchParams.get("topicIndex");
        const topicThreshold = searchParams.get("topicThreshold");
        const skip = parseInt(searchParams.get("skip") || "0");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Build match stage for filtering
        const matchStage = {};

        if (topicIndex !== null && topicThreshold !== null) {
            const index = parseInt(topicIndex);
            const threshold = parseFloat(topicThreshold);

            // Filter articles where topics[index] > threshold
            matchStage[`topics.${index}`] = { $gt: threshold };
        }

        // Get articles for display
        const query = Object.keys(matchStage).length > 0 ? matchStage : {};
        let sampleArticles = await Article.find(query)
            .select("headline web_url topics pub_date")
            .lean();

        // Add topic percentage for each article
        const articlesWithPercentage = sampleArticles.map((article) => {
            let topicPercentage = null;
            if (topicIndex !== null && article.topics) {
                const index = parseInt(topicIndex);
                topicPercentage = article.topics[index]
                    ? article.topics[index] * 100
                    : 0;
            }
            return {
                headline: article.headline,
                web_url: article.web_url,
                pub_date: article.pub_date,
                topicPercentage,
            };
        });

        // Sort by highest topic percentage (if topic selected) or by date
        articlesWithPercentage.sort((a, b) => {
            if (
                topicIndex !== null &&
                a.topicPercentage !== null &&
                b.topicPercentage !== null
            ) {
                return b.topicPercentage - a.topicPercentage;
            }
            return new Date(b.pub_date) - new Date(a.pub_date);
        });

        // Get total count
        const totalCount = articlesWithPercentage.length;

        // Apply pagination
        const paginatedArticles = articlesWithPercentage
            .slice(skip, skip + limit)
            .map((article) => ({
                headline: article.headline,
                web_url: article.web_url,
                pub_date: article.pub_date,
                topicPercentage:
                    article.topicPercentage !== null
                        ? article.topicPercentage.toFixed(2)
                        : null,
            }));

        return NextResponse.json({
            success: true,
            articles: paginatedArticles,
            total: totalCount,
            hasMore: skip + limit < totalCount,
        });
    } catch (error) {
        console.error("Error fetching article examples:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch article examples" },
            { status: 500 }
        );
    }
}
