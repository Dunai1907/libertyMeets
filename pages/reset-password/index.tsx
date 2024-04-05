import config from "config";
import { GetServerSideProps } from "next";
import ResetPassword from "../../Components/ResetPassword/ResetPassword";

type ResetPasswordPageProps = { appUrl: string };

export default function ResetPasswordPage({ appUrl }: ResetPasswordPageProps) {
  return (
    <>
      <ResetPassword appUrl={appUrl} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  return {
    props: { appUrl },
  };
};
