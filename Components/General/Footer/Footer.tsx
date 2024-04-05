import Link from "next/link";
import LibertyMeetsLogo from "../../LibertyMeetsLogo";

import styles from "./Footer.module.scss";

export default function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <Link href={"/"}>
          <LibertyMeetsLogo /></Link>
      </div>
      <div className={styles.footerInfo}>
        <Link className={styles.linkAbout} href="/about">
          <div className={styles.clickableText}>
            About LibertyMeets
          </div>
        </Link>
        <div className={styles.liberty}>LibertyMeets ©️ 2023</div>
      </div>
    </footer>
  );
}
