import { Link } from "react-router-dom";
import styles from "./About.module.css";

const GRID_ITEMS = [
    {
        label: "The Corpus",
        text: "18,218 New York Times articles published between March 1985 and December 1991. Metadata — headlines, dates, sections, and keywords — was retrieved via the official NYT Article Search API and filtered against key geographic and political terms. Full article texts were then collected separately using custom Node.js scripts powered by Puppeteer, which scraped the newspaper's digital archive page by page. The result is a representative sample of Soviet-themed coverage spanning seven years.",
    },
    {
        label: "The Method",
        text: "Latent Dirichlet Allocation (LDA), implemented with MALLET, was applied to the full corpus after standard preprocessing — stopword removal, lemmatization, and frequency filtering. After a series of experiments, a 14-topic model was selected. For each article, the algorithm produced a probability distribution across all topics; a topic was considered dominant when it accounted for more than half of that article's thematic weight.",
    },
    {
        label: "Database",
        text: "MALLET produces topic distributions as raw output files. To make the results navigable, a SQLite database was assembled from two sources: the article metadata retrieved via the NYT Article Search API — headline, date, section, keywords, abstract, and URL — and the per-article topic weights output by the LDA model. This application queries that database directly, allowing the full corpus to be filtered, sorted, and charted by topic, time, and section.",
    },
    {
        label: "Visualization",
        text: "The application is built as a single-page application using React and Vite. Topic trends over time are rendered as line charts via Chart.js, chosen for its flexibility in displaying multi-series temporal data across the seven-year span of the corpus. Each chart plots monthly or yearly article counts per topic, making long-term shifts and sudden spikes — like the surge in national movements coverage during 1991 — immediately legible.",
    },
];

export default function About() {
    return (
        <div className={styles.container}>
            <div className={styles.eyebrow}>
                Master&rsquo;s Thesis &middot; UCU &amp; University of
                Nottingham &middot; June 2026
            </div>

            <h1 className={styles.heading}>
                Mining The New York Times&rsquo; Coverage of the Soviet Collapse
            </h1>

            <p className={styles.subheading}>
                How one of the world&rsquo;s most influential newspapers
                constructed its image of the Soviet collapse &mdash; not through
                a handful of striking articles, but through the aggregate
                structure of thousands of publications spanning seven years.
            </p>

            <div className={styles.divider} />

            <p className={styles.bodyParagraph}>
                <span className={styles.dropcap}>T</span>
                his project grew out of a joint master&rsquo;s thesis at the
                Ukrainian Catholic University and the University of Nottingham.
                The goal was simple to state and difficult to execute: to
                understand how The New York Times constructed its image of the
                Soviet collapse. No single person can read and systematize the
                entire body of NYT material on the USSR over such a period
                closely enough to see overall patterns rather than isolated
                stories &mdash; and that is precisely why the project turned to
                <strong> LDA (Latent Dirichlet Allocation)</strong> topic
                modeling as its primary analytical tool. But before any modeling
                could begin, the corpus itself had to be assembled. Using the
                official NYT Article Search API, metadata was retrieved for
                every article containing the word &ldquo;soviet&rdquo; published
                between March 1985 and December 1991 &mdash; then filtered
                against key terms from &ldquo;ussr&rdquo; and
                &ldquo;moscow&rdquo; to the names of every constituent republic.
                Full article texts were then collected separately using custom
                Node.js scripts powered by Puppeteer, which scraped the
                newspaper&rsquo;s digital archive page by page. The result was a
                corpus of 18,218 articles.
            </p>

            <p className={styles.bodyParagraph}>
                The thematic modeling was implemented with{" "}
                <strong>MALLET</strong> &mdash; a Java-based toolkit widely used
                in digital humanities for its efficient Gibbs sampling. The
                corpus was first preprocessed through stopword removal,
                lemmatization, and frequency filtering, after which a series of
                experiments with different topic counts led to settling on a
                14-topic model. For each article, the algorithm produced a
                probability distribution across all topics; a topic was
                considered &ldquo;dominant&rdquo; when it accounted for more
                than half of that article&rsquo;s thematic weight. LDA&rsquo;s
                limits are worth naming: it ignores word order and syntax, and
                the number of topics is set by the researcher rather than
                inferred from the data. The results aren&rsƒquo;t a final
                verdict &mdash; they&rsquo;re a map that requires further
                interpretation and close reading, which is exactly what the rest
                of the thesis was devoted to.
            </p>

            <div className={styles.grid}>
                {GRID_ITEMS.map(({ label, text }) => (
                    <div key={label} className={styles.gridItem}>
                        <div className={styles.gridItemLabel}>{label}</div>
                        <p className={styles.gridItemText}>{text}</p>
                    </div>
                ))}
            </div>

            <p className={styles.bodyParagraph}>
                The fourteen topics that emerged fall into several broad
                clusters. The largest is diplomatic and strategic: summits, arms
                control, Afghanistan, the balance of power in Europe. A second
                cluster concerns Soviet domestic politics &mdash; power, reform,
                and the language of freedom and democracy &mdash; alongside a
                sharply bounded topic tied to espionage scandals that spiked in
                1985 and nearly disappeared after 1987. A cultural-intellectual
                cluster captures the coverage of arts, religion, and the slow
                opening of Soviet society. And running beneath all of them,
                growing in weight year after year, is the topic of national
                movements &mdash; the republics, the protests, the declarations
                of sovereignty.
            </p>

            <p className={styles.bodyParagraphLast}>
                What the model reveals is less about what the NYT covered than
                about the shape of that coverage over time. The diplomatic frame
                dominated throughout, but its grip loosened as the period
                advanced. The national movements topic climbed almost without
                interruption, overtaking even arms control by 1991 &mdash; a
                shift visible in the data before it became obvious in hindsight.
                The economy, by contrast, was strikingly underrepresented: the
                NYT wrote about Soviet economic life mainly when it became a
                matter of diplomacy or official policy, rarely as something
                people experienced directly. These asymmetries are not just
                curiosities &mdash; they are evidence of how a major Western
                newspaper constructed its understanding of a collapsing empire,
                and of which stories it chose to tell, and which it left in the
                margins.
            </p>

            <Link to="/topics" className={styles.cta}>
                Open the Explorer{" "}
                <span className={styles.ctaArrow}>&rarr;</span>
            </Link>

            <div className={styles.pageFooter}>
                Created by{" "}
                <a
                    href="https://ian.shp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ivan Shpynda
                </a>{" "}
                &mdash; All rights reserved &copy; {new Date().getFullYear()}
            </div>
        </div>
    );
}
