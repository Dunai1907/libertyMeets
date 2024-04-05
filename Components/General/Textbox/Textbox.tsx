import styles from "./Textbox.module.scss";

export default function Textbox() {
  return (
    <section className={styles.container}>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>What Is LibertyMeets?</h4>
        <ul className={styles.textboxDescription}>
          <li>Unlike social media sites, LibertyMeets
            is geared toward in-person connections to
            form local bonds and take action in your community.
          </li>
          <li>Many conservative/libertarians/moderates
            of all ages would like to get more involved
            politically but don&apos;t know exactly how,
            beyond contacting representatives/campaigns,
            searching in a roundabout way where/how to volunteer,
            responding to solicitations, posting on social media,
            and voting.
          </li>
          <li>They would also like to find new like-minded
            peers to engage with socially and professionally,
            especially younger adults who may feel isolated in
            progressive cities and organizations. Their fervor
            is being undeserved without a clearer and easier way
            to connect in-person with other freedom-oriented people.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>Your Privacy Is Paramount</h4>
        <ul className={styles.textboxDescription}>
          <li>Sign-up information is to ensure users
            are connecting with real people.
          </li>
          <li>Other than that, your business
            isn&apos;t our business. We do not and will not
            share or sell your information.
          </li>
          <li>When you reply to a post, or someone replies
            to your post, your email address is anonymous.
            Feel free to see our privacy policy for details.
          </li>
        </ul>
      </div>
      <div className={styles.textbox}>
        <h4 className={styles.textboxTitle}>How Does It Work?</h4>
        <ul className={styles.textboxDescription}>
          <li>Simplicity and speed are our goals.</li>
          <li>Anyone can browse and respond to public posts.</li>
          <li>Sign up to post, view and respond to private posts,
            and keep track of your favorite posts.
          </li>
          <li>Here&apos;s a short video exploring the site&apos;s functionality.</li>
        </ul>
      </div>
    </section>
  );
}
