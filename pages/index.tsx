import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LandingMain from "../Components/General/LandingMain/LandingMain";

export default function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  return (
    <>
      <LandingMain />
    </>
  );
}
