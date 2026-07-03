import { Link } from "react-router-dom";
import styles from "./About.module.css";

const GRID_ITEMS = [
    {
        label: "The Corpus",
        text: "18,218 New York Times articles published between March 1985 and December 1991 — collected via the official NYT Article Search API, filtered against key geographic and political terms, and assembled into a representative sample of Soviet-themed coverage across seven years.",
    },
    {
        label: "The Method",
        text: "Latent Dirichlet Allocation (LDA), implemented with MALLET, applied to the full corpus after standard preprocessing: stopword removal, lemmatization, and frequency filtering. A 14-topic model. A topic was considered dominant for a given article when it accounted for more than half of that article's thematic weight.",
    },
    {
        label: "Economic Coverage",
        text: "Coverage of the Soviet economy proved structurally thin — centered on figures, Western aid, and official reform programs rather than on the everyday experience of shortages and hardship. The NYT wrote about the economy mainly when it became a matter of diplomacy, not of people's lived experience.",
    },
    {
        label: "National Movements",
        text: "The national movements topic showed the most dramatic trajectory of any cluster, climbing almost continuously across the entire period and eventually overtaking the diplomatic theme by 1991, peaking during the August coup. Baltic coverage gained weight faster and more consistently than Caucasian or Central Asian stories.",
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
                stories. So data collection proceeded in two stages. Using the
                official NYT Article Search API, metadata was retrieved for
                every article containing the word &ldquo;soviet&rdquo; published
                between March 1985 and December 1991 &mdash; then filtered
                against key terms from &ldquo;ussr&rdquo; and
                &ldquo;moscow&rdquo; to the names of every constituent republic.
                Custom Node.js scripts then pulled the full texts from the
                newspaper&rsquo;s digital archive. The result was a corpus of
                18,218 articles.
            </p>

            <p className={styles.bodyParagraph}>
                To uncover hidden thematic structures within such a large volume
                of text, the project applied topic modeling using{" "}
                <strong>LDA (Latent Dirichlet Allocation)</strong> &mdash; a
                statistical approach that treats each document as a mixture of
                topics and each topic as a probability distribution over words,
                implemented with MALLET. After preprocessing and a series of
                experiments, a 14-topic model was settled on. For each article,
                the algorithm calculated how strongly it belonged to each topic;
                a topic was considered &ldquo;dominant&rdquo; when it accounted
                for more than half of that article&rsquo;s thematic weight.
                LDA&rsquo;s limits are worth naming: it ignores word order and
                syntax, and the number of topics is chosen by the researcher.
                The results aren&rsquo;t a final verdict &mdash; they&rsquo;re a
                map that requires further interpretation and close reading,
                which is exactly what the rest of the thesis was devoted to.
            </p>

            <p className={styles.bodyParagraph}>
                The fourteen topics that emerged grouped into several thematic
                clusters. The most dominant is diplomatic and strategic:
                summits, nuclear arms control, the balance of power in Europe,
                and the war in Afghanistan. The nuclear arms control topic
                turned out to be the single most frequently dominant topic
                across the entire corpus, appearing in over a thousand articles.
                A second cluster concerns Soviet domestic politics &mdash;
                power, freedom, democracy &mdash; alongside a separate topic
                tied to espionage scandals that dominated sharply in 1985 and
                nearly vanished after 1987. The economic cluster produced the
                most striking finding: coverage was comparatively thin and
                statistical, built around figures and official programs rather
                than lived experience. And the national movements topic climbed
                almost continuously across the entire period, eventually
                overtaking even the diplomatic theme by 1991.
            </p>

            <p className={styles.bodyParagraphLast}>
                The most valuable findings concern less the topics themselves
                than their absence or unevenness. The NYT covered the Soviet
                economy mainly when it became a matter of diplomacy, not of
                people&rsquo;s lived experience. Attention to national movements
                was unevenly distributed: the Baltic story gained weight faster
                and more consistently than the Caucasian or Central Asian
                stories. And cultural liberalization was largely described
                through the official Soviet term &ldquo;glasnost&rdquo; rather
                than through independent framing &mdash; itself a sign of how
                much the paper&rsquo;s editorial lens depended on the official
                agenda. These observations support a hypothesis familiar to
                media scholars: major Western outlets tend to cover other
                societies primarily through the actions of elites rather than
                the experience of ordinary people, and to reproduce the
                vocabulary of official sources even when writing about processes
                that extend well beyond that vocabulary.
            </p>

            <div className={styles.grid}>
                {GRID_ITEMS.map(({ label, text }) => (
                    <div key={label} className={styles.gridItem}>
                        <div className={styles.gridItemLabel}>{label}</div>
                        <p className={styles.gridItemText}>{text}</p>
                    </div>
                ))}
            </div>

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
