import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <section className={styles.container}>
      <span className={styles.codeMessage}>404</span>
      <span className={styles.message}>Not Found</span>
    </section>
  );
}
