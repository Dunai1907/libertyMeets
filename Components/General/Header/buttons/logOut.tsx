import styles from "../Header.module.scss";
import { Button } from "antd";
import { signOut } from "next-auth/react";

export default function LogOut() {
  return (
    <li className={styles.navigationItem}>
      {" "}
      <Button type="text" className={styles.logOut} onClick={() => signOut({ callbackUrl: '/' })}>
        Log Out
      </Button>
    </li>
  );
}
