import config from "config";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import CreatePost from "../Components/CreatePost/CreatePost";

type PropsType = { appUrl: string };

export default function CreatePostPage({ appUrl }: PropsType) {
  return <CreatePost appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  if (!session?.user) {
    return {
      notFound: true,
    };
  }

  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
