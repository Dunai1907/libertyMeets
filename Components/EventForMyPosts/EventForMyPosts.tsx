import Image from "next/image";
import styles from "./EventForMyPosts.module.scss";
import Link from "next/link";
import moment from "moment";
import Location from "../Location/Location";
import { Posts } from "../../models/posts";

type EventForMyPostsProps = {
  post: Posts & { is_favorite?: boolean; favoriteUsers: { id: number }[] };
  movePost?: (postId: number) => void;
};

export default function EventForMyPosts({
  post,
  movePost,
}: EventForMyPostsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.star}>
        {post.is_favorite ? (
          <Image
            src="/decor/starFaiv.svg"
            alt=""
            width={20}
            height={20}
            className={styles.starImage}
            onClick={() => movePost!(post.id)}
          />
        ) : (
          <></>
        )}
      </div>
      <Link className={styles.link} href={`/posts/${post.id}/?fromUrl=myPosts`}>
        <div className={styles.postDate}>
          {moment(post.created_at).format("MMM DD, YYYY")}
        </div>
        <div className={styles.postInfo}>
          <div className={styles.leftBlock}>
            <div className={styles.label}>{post.category}</div>
            <div className={styles.info}>{post.title}</div>
          </div>
          <div className={styles.rightBlock}>
            {post.is_blocked && (
              <div className={styles.blocked}>
                <span className={styles.blockedText}>blocked</span>{" "}
              </div>
            )}
          </div>
        </div>
        <div className={styles.postLocation}>
          {/* {moment(post.created_at).format("MMM DD, YYYY")} */}
          <Location post={post} />
        </div>
      </Link>
    </div>
  );
}
