import styles from "./AboutBlock.module.scss";
import Image from "next/image";

type line = {
  text: string;
  isMarked: boolean;
};

type imgProps = {
  src: string;
  width: number;
  height: number;
};

type PropsType = {
  img: imgProps;
  title: string;
  lines: line[];
};

export default function AboutBlock({ img, title, lines }: PropsType) {
  return (
    <>
      <div className={styles.block}>
        <h2>{title}</h2>
        <div className={styles.valuesContent}>
          <Image
            src={img.src}
            alt={title}
            width={img.width}
            height={img.height}
          />
          <div className={styles.valuesList}>
            {lines.map((line, index) => (
              <div
                className={
                  line.isMarked ? styles.markedLine : styles.unmarkedLine
                }
                key={index}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
