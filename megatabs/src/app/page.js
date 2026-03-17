import styles from "./page.module.css";
import Prototype from "./Prototype";

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1 className={styles.mainHeading}>MegaTabs</h1>
				<div className={styles.prototype}>
					<Prototype />
				</div>
			</main>
		</div>
	);
}
