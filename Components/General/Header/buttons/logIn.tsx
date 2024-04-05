import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";

export default function LogIn() {
  return (
    <li className={styles.navigationItem}>
      {" "}
      <Link className={styles.navigationItemLink} href={"/signin"}>
        <Button type="text" className={styles.logIn}>
          Log In
        </Button>
      </Link>
    </li>
  );
}
