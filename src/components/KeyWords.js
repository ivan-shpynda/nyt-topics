import { KEYWORDS } from "@/helpers/constants";

export default function KeyWords({ topicIndex }) {
    if (topicIndex === "") {
        return <div></div>;
    }

    const keywords = KEYWORDS[topicIndex] || [];

    return (
        <div>
            <h2>Most frequent words</h2>
            <p>{keywords.split(" ").join(", ")}</p>
        </div>
    );
}
