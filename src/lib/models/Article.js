import mongoose from "mongoose";
/*
_id: "nyt://article/97b02a94-e5e8-531e-aa0e-32d140c9f762"
headline: "REAGAN ASKS VOTE FOR MX FINANCING TO AID ARMS TALKS"
keywords: Array (9)
news_desk: "National Desk"
pub_date: "1985-03-05T05:00:00Z"
section_name: "U.S."
web_url: "https://www.nytimes.com/1985/03/05/us/reagan-asks-vote-for-mx-financin…"
*/

const ArticleSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        default: [],
    },
    news_desk: {
        type: String,
        default: "",
    },
    pub_date: {
        type: Date, // MongoDB Date object
        required: true,
    },
    section_name: {
        type: String,
        default: "",
    },
    web_url: {
        type: String,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
});

// Explicitly specify collection name to ensure it matches your MongoDB collection
export default mongoose.models.Article ||
    mongoose.model("Article", ArticleSchema, "articles");
