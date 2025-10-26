import classes from "./Footer.module.css";

export default function Footer() {
    return (
        <footer>
            <p className={classes.footer}>
                &copy; {new Date().getFullYear()} | Made by Ivan Shpynda
            </p>
        </footer>
    );
}
