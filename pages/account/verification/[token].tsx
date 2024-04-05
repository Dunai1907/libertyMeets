import axios from "axios";
import config from "config";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AccountToken from "../../../Components/General/AccountStatus/AccountToken";

type ChangeAccountStateProps = { appUrl: string };

export default function ChangeAccountStatePage({
  appUrl,
}: ChangeAccountStateProps) {
  const [isError, setIsError] = useState<boolean>(false);

  const router = useRouter();
  const token = router.query.token;

  useEffect(() => {
    (async () => {
      const req = await axios.post(`${appUrl}/api/users/email-verification`, {
        token: token,
      });

      if (req.status !== 200) {
        setIsError(true);
        return;
      }

      setTimeout(async () => {
        await signIn("autoCredentials", {
          ...{ token },
          callbackUrl: "/posts",
        });
      }, 5000);
    })();
  }, [appUrl, router, token]);

  return isError ? (
    <AccountToken isError={true} />
  ) : (
    <AccountToken isError={false} />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};
