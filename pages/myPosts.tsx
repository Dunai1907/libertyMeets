import { GetServerSideProps } from "next";
import config from "config";
import { getSession } from "next-auth/react";
import { getUserPosts } from "../services/posts";
import MyPosts from "../Components/MyPosts/MyPosts";
import { ExchangePostType } from "../types/general";

type MyPostsPageProps = {
  appUrl: string;
  postsPerPage: number;
  posts: ExchangePostType[];
  count: number;
};

export default function MyPostsPage({
  appUrl,
  postsPerPage,
  posts,
  count,
}: MyPostsPageProps) {
  return (
    <MyPosts
      appUrl={appUrl}
      postsPerPage={postsPerPage}
      initialPosts={posts}
      initialCount={count}
      activePage="My Posts"
    />
  );
}

export const getServerSideProps: GetServerSideProps<MyPostsPageProps> = async (
  ctx
) => {
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

  const res = await getUserPosts(page, session.user.id);
  if (!res) {
    return {
      notFound: true,
    };
  }

  const posts = res.userPosts
    .map((item) => item.toJSON())
    .map((item) => {
      item.created_at = item.created_at.toISOString();
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
