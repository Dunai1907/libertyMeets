import styles from "./Terms.module.scss";

export default function Terms() {
  return (
    <section className={styles.container}>
      <div className={styles.terms}>
        <h4 className={styles.termsTitle}>Our Privacy Policy</h4>
        <p className={styles.termsDescriptionBold}>
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You. We use Your Personal data to provide and improve the
          Service. By using the Service, You agree to the collection and use of
          information in accordance with this Privacy Policy.
          <br />
          <br />
          This privacy policy applies to the information that You provide to
          LibertyMeets.com (“Service”).
        </p>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.termsTitle}>What Info We Collect</h4>
        <p className={styles.termsDescription}>
          We may collect, use, transfer, and disclose Your information for the
          following purposes:
        </p>
        <ul className={styles.termsList}>
          <li>to facilitate and perform services You have requested;</li>
          <li>
            to provide You with information that You request or which You may
            need in order to contact Us (for example, if You submit a comment,
            question or complaint to Us, We may respond to Your message);
          </li>
          <li>for internal recordkeeping;</li>
          <li>to administer the Service;</li>
          <li>to communicate with You regarding the Service;</li>
          <li>to improve and customize the Service;</li>
          <li>to notify You about changes to the Service;</li>
          <li>to notify You about changes to the Service; </li>
          <li>to comply with the law; and </li>
          <li>
            as described to You at the point where You provide Your information
            to Us.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.termsTitle}>How Does It Work?</h4>
        <p className={styles.termsDescription}>
          We use Your information to provide and improve the Service. We do not
          share Your information with third parties.
        </p>
        <span className={styles.cookies}>COLLECTION AND USE OF COOKIES</span>
        <p className={styles.termsDescription}>
          A cookie is a small piece of data stored on Your computer that
          identifies Your browser and thatThis Privacy Policy describes Our
          policies and procedures on the collection, use and disclosure of Your
          information when You use the Service and tells You about Your privacy
          rights and how the law protects You. We use Your Personal data to
          provide and improve the Service. By using the Service, You agree to
          the collection and use of information in accordance with this Privacy
          Policy.
        </p>
      </div>
    </section>
  );
}
