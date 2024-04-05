import { useState, useEffect } from "react";
import AddListing from "../AddListing/AddListing";
import NavBar from "../General/NavBar/NavBar";
import { isToday, isYesterday } from "../../utils/eventTimeStatus";
import styles from "./Events.module.scss";
import { useRouter } from "next/router";
import { ExchangePostType } from "../../types/general";
import PostsList from "../PostsList";
import axios from "axios";
import { PaginationForPosts } from "../General/Pagination/Pagination";
import { message } from "antd";
import getLocation from "../../services/geocodeSearch";
import { Posts } from "../../models/posts";

type PropsType = {
  appUrl: string;
  postsPerPage: number;
  initialPosts: ExchangePostType[];
  initialCount: number;
  isLogin: boolean;
};

type queryType = {
  page?: number;
  category?: string;
  zip?: string;
  radius?: string;
  lat?: number;
  lng?: number;
};

export default function Events({
  appUrl,
  postsPerPage,
  initialPosts,
  initialCount,
  isLogin,
}: PropsType) {
  const [current, setCurrent] = useState<number>(1);
  const [isViewForAllCategory, setIsViewForAllCategory] =
    useState<boolean>(true);
  const [posts, setPosts] = useState<ExchangePostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(initialCount);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [radius, setRadius] = useState<string | undefined>(undefined);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const error = (text: string) => {
    messageApi.destroy();
    messageApi.open({
      type: "error",
      content: text,
      duration: 10,
      style: {
        marginTop: "15vh",
      },
    });
  };

  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialCount);
  }, [initialPosts, initialCount]);

  let page = 1;
  useEffect(() => {
    if (router.query?.page) {
      setCurrent(Number(router.query?.page));
    }
    if (router.query.category && typeof router.query.category === "string") {
      setCategory(router.query.category);
    }
    if (router.query.radius && typeof router.query.radius === "string") {
      setRadius(router.query?.radius);
    }
    if (router.query.zip && typeof router.query.zip === "string") {
      setZipCode(router.query?.zip);
    }
  }, [
    router.query.category,
    router.query?.page,
    router.query?.radius,
    router.query?.zip,
  ]);

  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  async function fillQueryParams(query: queryType) {
    if (category) {
      query.category = category;
    }
    if (zipCode) {
      query.zip = zipCode;
    }
    if (radius) {
      query.radius = radius;
    }
    if (lat !== undefined && lng !== undefined) {
      query.lat = lat;
      query.lng = lng;
    }
  }

  function changePageNumber(page: number) {
    setCurrent(page);
    const query: queryType = { page };
    fillQueryParams(query);
    query.page = page;
    router.push({
      pathname: `${appUrl}/posts`,
      query: query,
    });
  }

  async function changeCategory(category: string) {
    const query: queryType = {};
    await fillQueryParams(query);

    if (category === "All" || category === undefined) {
      setIsViewForAllCategory(true);
    } else {
      setIsViewForAllCategory(false);
    }
    if (category === "All") {
      setCategory(undefined);
      query.category = undefined;
      router.push({
        pathname: `${appUrl}/posts`,
        query: query,
      });

      return;
    }
    setCategory(category);
    setCurrent(1);
    query.category = category;
    router.push({
      pathname: `${appUrl}/posts`,
      query: query,
    });
  }

  async function changeStar(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    const currentPosts = posts;
    const foundPost = currentPosts.find((item) => item.id === postId);

    if (!foundPost) {
      return;
    }

    foundPost.is_favorite = res.data.data.isFavorite;
    foundPost.favoriteUsers = [];
    setPosts([...currentPosts]);
  }

  function getPostsByDate(
    posts: (Posts & {
      is_favorite?: boolean;
      favoriteUsers: { id: number }[];
    })[],
    filterFn: (date: Date) => boolean
  ) {
    return posts.filter((post) => filterFn(new Date(post.created_at)));
  }

  async function searchByZipCode(zip: string) {
    if (!zip || zip === "") {
      setZipCode(undefined);
      const dataForQuery: queryType = {};
      await fillQueryParams(dataForQuery);
      dataForQuery.zip = zip;
      router.push({
        pathname: `${appUrl}/posts`,
        query: dataForQuery,
      });
      return;
    }

    if (zip.length < 5) {
      return;
    }

    const dataForQuery: queryType = {};
    await fillQueryParams(dataForQuery);
    dataForQuery.zip = zip;
    router.push({
      pathname: `${appUrl}/posts`,
      query: dataForQuery,
    });
  }

  async function searchByRadius(radius: string) {
    const dataForQuery: queryType = {};

    if (
      (lat === undefined || lng === undefined) &&
      (!zipCode || zipCode === "")
    ) {
      error("Provide a zip code for radius sampling");
      return;
    }

    if (!radius || radius === "") {
      setRadius(undefined);
      await fillQueryParams(dataForQuery);
      dataForQuery.radius = undefined;
      router.push({
        pathname: `${appUrl}/posts`,
        query: dataForQuery,
      });
    }

    setRadius(radius);

    await fillQueryParams(dataForQuery);
    dataForQuery.radius = radius;
    if (zipCode) {
      const locations = await getLocation(zipCode);
      if (locations?.locations[0]) {
        dataForQuery.lat = locations.locations[0].geometry.location.lat;
        dataForQuery.lng = locations.locations[0].geometry.location.lng;
        setLat(dataForQuery.lat);
        setLng(dataForQuery.lng);
      }
    }

    router.push({
      pathname: `${appUrl}/posts`,
      query: dataForQuery,
    });
  }

  return (
    <>
      <div className={styles.error}>{contextHolder}</div>
      <section className={styles.eventsPageContainer}>
        <div className={styles.navigation}>
          <NavBar
            zip={zipCode}
            setZip={setZipCode}
            radius={radius}
            appUrl={appUrl}
            setLat={setLat}
            setLng={setLng}
            changeCategory={changeCategory}
            searchByZipCode={searchByZipCode}
            searchByRadius={searchByRadius}
          />
        </div>
        <div className={styles.wrap}>
          <div className={styles.container}>
            <div className={styles.eventsContainer}>
              <div className={styles.eventsSubBlock}>
                {getPostsByDate(posts, isToday).length > 0 && (
                  <div className={styles.eventsSubBlockTitle}>
                    <span className={styles.buttonDay}>Today</span>
                  </div>
                )}
                <PostsList
                  posts={getPostsByDate(posts, isToday)}
                  changeStar={changeStar}
                  isViewForAllCategory={isViewForAllCategory}
                  isLogin={isLogin}
                />
                {getPostsByDate(posts, isYesterday).length > 0 && (
                  <div className={styles.eventsSubBlockTitle}>
                    <span className={styles.buttonDay}>Yesterday</span>
                  </div>
                )}
                <PostsList
                  posts={getPostsByDate(posts, isYesterday)}
                  changeStar={changeStar}
                  isViewForAllCategory={isViewForAllCategory}
                  isLogin={isLogin}
                />
                {getPostsByDate(
                  posts,
                  (date) => !isYesterday(date) && !isToday(date)
                ).length > 0 && (
                  <div className={styles.eventsSubBlockTitle}>
                    <span className={styles.buttonDay}>Earlier</span>
                  </div>
                )}
                <PostsList
                  posts={getPostsByDate(
                    posts,
                    (date) => !isYesterday(date) && !isToday(date)
                  )}
                  changeStar={changeStar}
                  isViewForAllCategory={isViewForAllCategory}
                  isLogin={isLogin}
                />
              </div>
            </div>
            <PaginationForPosts
              category={category}
              totalCount={totalCount}
              appUrl={appUrl}
              postsPerPage={postsPerPage}
              changePage={changePageNumber}
            />
            <AddListing />
          </div>
        </div>
      </section>
    </>
  );
}
