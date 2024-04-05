import styles from "./RememberBlock.module.scss";
import Image from "next/image";

export default function RememberBlock() {
  return (
    <section className={styles.rememberWrapper}>
      <Image
        src="/decor/remember.svg"
        alt=""
        width={45}
        height={41}
        className={styles.rememberImage}
      />
      <span className={styles.title}>Remember!</span>
      <p className={styles.description}>
        Please do not give time/location details or personal identifying
        information in the post title or description. And if you are meeting
        with strangers, please do so in a public place.
      </p>
    </section>
  );
}
