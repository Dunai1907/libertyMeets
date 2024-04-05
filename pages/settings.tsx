import config from "config";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Settings from "../Components/General/Settings/Settings";

type SettingsProps = { appUrl: string };

export default function SettingsPage({ appUrl }: SettingsProps) {
  return <Settings appUrl={appUrl} activePage="Settings" />;
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
