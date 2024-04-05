import { Button } from "antd";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import styles from "./LackOfPosts.module.scss";
import Image from "next/image";
import Link from "next/link";

const buttonMap = {
  showFaivorites: ["my-favorites", ""],
  showMyPosts: ["myPosts", ""]
};

export default function LackOfPosts() {
  const router: NextRouter = useRouter();
  const url: Array<string> = router.route.split("/");
  const page: string = url.slice(1, url.length).join("/");
  return (
    <div>
      {buttonMap.showFaivorites.indexOf(page) !== -1 && <div>
        <div className={styles.container}>
          <div className={styles.noCriteria}>
            Your favorite posts will be displayed here, find some and add them now!
          </div>
          <div className={styles.title}>Go to</div>

          <Link className={styles.search} href={"/posts"}>
        
        <Image
          src="/decor/Vector4.svg"
          alt=""
          width={16}
          height={14}
          className={styles.vector}
        />
        <span className={styles.searchText}>Search Opportunities </span>
      
    </Link>
        </div>
      </div>}
      {buttonMap.showMyPosts.indexOf(page) !== -1 && <div
        className={styles.container}>
        <div className={styles.noCriteria}>
          You do not have any posts that you are the author of.
        </div>
        <div className={styles.title}>you can create it right now</div>
        <Link className={styles.createPosts} href={"/createPost"}>
          <Image
            src="/decor/Vector3.svg"
            alt=""
            width={16}
            height={14}
            className={styles.vector}
          />
          <span className={styles.createPostsText}>Create Post </span>
      </Link>
      </div>}
    </div>
  );
}
