import { GetServerSideProps } from "next";
import config from "config";
import { getFavoritePosts } from "../services/posts";
import { getSession } from "next-auth/react";
import MyPosts from "../Components/MyPosts/MyPosts";
import { ExchangePostType } from "../types/general";

type MyFavoritesPageProps = {
  appUrl: string;
  postsPerPage: number;
  posts: ExchangePostType[];
  count: number;
};

export default function MyFavoritesPageProps({
  appUrl,
  postsPerPage,
  posts,
  count,
}: MyFavoritesPageProps) {
  return (
    <MyPosts
      appUrl={appUrl}
      postsPerPage={postsPerPage}
      initialPosts={posts}
      initialCount={count}
      postsIsFavorites={true}
      activePage="My Favorites"
    />
  );
}

export const getServerSideProps: GetServerSideProps<MyFavoritesPageProps> =
  async (ctx) => {
    const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
    const postsPerPage = config.get<number>("posts.perPage");

    const session = await getSession({ req: ctx.req });
    if (!session?.user) {
      return {
        notFound: true,
      };
    }

    let page = Number(ctx.query.page);
    if (isNaN(page)) {
      page = 1;
    }

    const res = await getFavoritePosts(page, session.user);
    if (!res) {
      return {
        notFound: true,
      };
    }

    const posts = res.posts
      .map((item) => item.toJSON())
      .map((item) => {
        item.created_at = item.created_at.toISOString();
        item.is_favorite = true;
        return item;
      });

    const count = res.count;

    return {
      props: {
        appUrl,
        postsPerPage,
        posts,
        count,
      },
    };
  };
