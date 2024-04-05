import Image from "next/image";
import styles from "./LandingMain.module.scss";
import Link from "next/link";
import SearchOpportunities from "../Header/buttons/searchOpportunities";
import SignUp from "../Header/buttons/signUp";
import AboutBlocks from "./AboutBlocks";

export default function LandingMain() {
  return (
    <section className={styles.container}>
      <section className={styles.titleBlock}>
        <div className={styles.logoInfo}>
          <div className={styles.infoBlock}>
            <Image
              src="/decor/Unframed.svg"
              alt="Liberty Meets"
              width={426}
              height={75}
              className={styles.logoImage}
            />
          </div>
          <h2 className={styles.description}>
            The place to find freedom-friendly folks near you.
          </h2>
        </div>
      </section>
      <section className={styles.valuesBlock}>
        <div className={styles.valuesContainer}>
          <AboutBlocks />
        </div>
        <div className={styles.buttonBlock}>
          <Link className={styles.buttonLearnLink} href="/about">
            <span className={styles.buttonLearnMore}>
              Learn More About LibertyMeets
            </span>
          </Link>
        </div>
      </section>
      <section className={styles.purpleBlock}>
        <article className={styles.descriptionPurple}>
          <q>
            <span className={styles.quote}>
              LibertyMeets has helped us find new like-minded friends in our
              town. Finally a platform with people who have our values and is
              more than sitting behind a keyboard.
            </span>
          </q>
          <br />
          <br />
          <span className={styles.quote}>Bob & Jessica Smith</span>
          <div className={styles.controlButtons}>
            <SearchOpportunities />
            <SignUp />
          </div>
        </article>
      </section>
    </section>
  );
}
