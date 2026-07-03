import { Link, useLocation } from "react-router-dom";
import styles from "./Nav.module.css";

export default function Nav() {
    const { pathname } = useLocation();

    return (
        <div className={styles.nav}>
            <Link to="/" className={styles.brand}>
                <span className={styles.brandTitle}>NYT Topics</span>
                <span className={styles.brandYear}>1985&ndash;1991</span>
            </Link>
            <div className={styles.links}>
                <Link
                    to="/"
                    className={`${styles.link} ${pathname === "/" ? styles.linkActive : ""}`}
                >
                    About
                </Link>
                <Link
                    to="/topics"
                    className={`${styles.link} ${pathname === "/topics" ? styles.linkActive : ""}`}
                >
                    Explorer
                </Link>
            </div>
        </div>
    );
}
