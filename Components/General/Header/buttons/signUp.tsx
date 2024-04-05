import styles from "../Header.module.scss";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  return (
    <li className={styles.navigationItem}>
      <Link className={styles.navigationItemLink} href={"/registration"}>
        <Button className={styles.signUp}>
          <Image
            src="/decor/Vector.svg"
            alt=""
            width={16}
            height={14}
            className={styles.signUpImage}
          />
          <span className={styles.signUpText}>Sign Up </span>
        </Button>
      </Link>
    </li>
  );
}
