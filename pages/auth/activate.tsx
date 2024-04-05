import config from "config";
import { GetServerSideProps } from "next";
import AuthActivated from "../../Components/AuthActivated/AuthActivated";

type ActivatePageProps = { appUrl: string };

export default function ActivatePage({ appUrl }: ActivatePageProps) {
  return <AuthActivated appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
