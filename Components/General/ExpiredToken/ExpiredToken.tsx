import styles from "./ExpiredToken.module.scss";

export default function ExpiredToken() {
  return (
    <section className={styles.container}>
      <h5 className={styles.codeMessage}>401</h5>
      <span className={styles.message}>Authorization Required</span>
    </section>
  );
}
