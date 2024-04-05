import styles from "./CheckEmail.module.scss";

export default function CheckEmail() {
  return (
    <section className={styles.container}>
      <h5 className={styles.message}>
        Your password reset request has been successfully submitted! Please
        check your email for further instructions on how to reset your password.
        If you do not receive an email within the next hour, please check your
        spam folder or contact support for assistance.
      </h5>
    </section>
  );
}
