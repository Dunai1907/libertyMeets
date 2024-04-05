import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";

export default function MyProfile() {
  return (
    <li className={styles.navigationItem}>
      {" "}
      <Link className={styles.navigationItemLink} href={"/my-favorites"}>
        <Button type="text" className={styles.myProfile}>
          My Profile
        </Button>
      </Link>
    </li>
  );
}
