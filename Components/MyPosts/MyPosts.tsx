import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import EventForMyPosts from "../EventForMyPosts/EventForMyPosts";
import Navigation from "../General/MyProfileNavigation/Navigation";
import styles from "./MyPosts.module.scss";
import LackOfPosts from "../LackOfPosts/LackOfPosts";
import { PaginationForPosts } from "../General/Pagination/Pagination";
import { ExchangePostType } from "../../types/general";

type MyPostsProps = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: ExchangePostType[];
  initialCount: number;
  postsIsFavorites?: boolean;
  activePage: string;
};

export default function MyPosts({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
  postsIsFavorites,
  activePage,
}: MyPostsProps) {
  const [posts, setPosts] = useState<ExchangePostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const router = useRouter();

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  function changePageNumber(page: number) {
    if (postsIsFavorites) {
      router.push({
        pathname: `${appUrl}/my-favorites`,
        query: { page },
      });
      return;
    }
    router.push({
      pathname: `${appUrl}/myPosts`,
      query: { page },
    });
  }

  async function movePost(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    if (res.status === 200) {
      router.push({
        pathname: `${appUrl}/my-favorites`,
        query: { page: 1 },
      });
    }
  }

  return (
    <section className={styles.profileWrapper}>
      <Navigation activePage={activePage} />
      {posts.length === 0 ? (
        // eslint-disable-next-line react/no-unescaped-entities
        <LackOfPosts />
      ) : (
        <section className={styles.profileContainer}>
          <div className={styles.container}>
            {posts.map((item: ExchangePostType) => (
              <EventForMyPosts key={item.id} post={item} movePost={movePost} />
            ))}
          </div>
          <PaginationForPosts
            totalCount={totalCount}
            appUrl={appUrl}
            postsPerPage={postsPerPage}
            changePage={changePageNumber}
          />
        </section>
      )}
    </section>
  );
}
