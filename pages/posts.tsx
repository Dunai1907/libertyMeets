import { GetServerSideProps } from "next";
import config from "config";
import Events from "../Components/Events/Events";
import { ExchangePostType } from "../types/general";
import { getPosts } from "../services/posts";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

type PostsPageProps = {
  session: Session | null;
  appUrl: string;
  postsPerPage: number;
  posts: ExchangePostType[];
  count: number;
};

export default function PostsPage({
  appUrl,
  postsPerPage,
  posts,
  count,
  session,
}: PostsPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [session]);

  return (
    <>
      <Events
        appUrl={appUrl}
        postsPerPage={postsPerPage}
        initialPosts={posts}
        initialCount={count}
        isLogin={isLogin}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PostsPageProps> = async (
  ctx
) => {
  // const emailParams = {
  //   subject:"",
  //   to: {
  //     email: "vburdylev@twelvedevs.com",
  //   },
  // };
  // await sendEmail("reset-password", emailParams, {user:{name:"MyName"}});

  const appUrl = process.env.NEXTAUTH_URL || config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");
  const session = await getSession({ req: ctx.req });
  const searchParams = {
    page: Number(ctx.query.page),
    category: ctx.query.category,
    zip: ctx.query.zip,
    lat: ctx.query.lat,
    lng: ctx.query.lng,
    radius: ctx.query.radius,
  };

  if (isNaN(searchParams.page)) {
    searchParams.page = 1;
  }

  const res = await getPosts(session?.user, searchParams);
  if (!res) {
    return { props: { session, appUrl, postsPerPage: 0, posts: [], count: 0 } };
  }

  const posts = res.posts
    .map((item) => item.toJSON())
    .map((item) => {
      item.created_at = item.created_at.toISOString();
      return item;
    });

  const count = res.count;

  return {
    props: {
      session,
      appUrl,
      postsPerPage,
      posts,
      count,
    },
  };
};
