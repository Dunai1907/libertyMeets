import styles from "./AccountToken.module.scss";

const informationInPage = {
  success: {
    message:
      " Your account has been successfully activated. You can now enjoy all the features of our service. If you have any questions, feel free to contact us. Have a good time using it!",
  },
  error: {
    message:
      "Sorry, an error has occurred. Please try again later or contact support for assistance.",
  },
};

export default function AccountToken({ isError }: { isError: boolean }) {
  return (
    <section className={styles.container}>
      <h5 className={styles.codeMessage}>{isError ? "Error!" : "Congratulations!"}</h5>
      <span className={styles.message}>
        {isError
          ? informationInPage.error.message
          : informationInPage.success.message}
      </span>
    </section>
  );
}
