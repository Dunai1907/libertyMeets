import config from "config";
import { GetServerSideProps } from "next";
import ChangePassword from "../../../Components/ChangePassword/ChangePassword";

type ChangePasswordProps = { appUrl: string };

export default function ChangePasswordPage({ appUrl }: ChangePasswordProps) {
  return <ChangePassword appUrl={appUrl} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
