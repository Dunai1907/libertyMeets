import config from "config";
import { GetServerSideProps } from "next";
import Registration from "../Components/Registration/Registration";

type PropsType = { appUrl: string; recaptchaKey: string };

export default function RegistrationPage({ appUrl, recaptchaKey }: PropsType) {
  return <Registration appUrl={appUrl} recaptchaKey={recaptchaKey} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const recaptchaKey = config.get<string>("recaptcha.public_recaptcha_key");
  return {
    props: { appUrl, recaptchaKey },
  };
};
