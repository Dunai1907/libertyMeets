import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExchangePostType } from "../../types/general";
import Location from "../Location/Location";
import styles from "./Event.module.scss";

type EventSingleRowProps = {
  post: ExchangePostType;
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
  isLogin: boolean;
};

export default function EventSingleRow(props: EventSingleRowProps) {
  const { post, changeStar, isViewForAllCategory, isLogin } = props;
  const router = useRouter();
  const pathname = router.pathname.slice(1);

  return (
    <div className={styles.container}>
      {isLogin && (
        <div className={styles.star}>
          {post.favoriteUsers?.length > 0 || post.is_favorite ? (
            <div
              onClick={() => {
                changeStar(post.id);
              }}
            >
              <Image
                src="/decor/starFaiv.svg"
                alt=""
                width={20}
                height={20}
                className={styles.starImage}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                changeStar(post.id);
              }}
            >
              <Image
                src="/decor/starNoFaiv.svg"
                alt=""
                width={20}
                height={20}
                className={styles.starImage}
              />
            </div>
          )}
        </div>
      )}

      <Link
        className={styles.link}
        href={`/posts/${post.id}/?fromUrl=${pathname}`}
      >
        <div className={styles.leftBlock}>
          {isViewForAllCategory ? (
            <div className={styles.label}>{post.category}</div>
          ) : (
            <></>
          )}
          <div className={styles.info}>{post.title}</div>
        </div>
        <div className={styles.rightBlock}>
          <Location post={post} />
        </div>
      </Link>
    </div>
  );
}
