import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.scss";
import LibertyMeetsLogo from "../../LibertyMeetsLogo";
import LogOut from "./buttons/logOut";
import MyProfile from "./buttons/myProfile";
import CreatePost from "./buttons/createPost";
import SearchOpportunities from "./buttons/searchOpportunities";
import LogIn from "./buttons/logIn";
import SignUp from "./buttons/signUp";
import Image from "next/image";

const buttonMap = {
  showSearch: [
    "",
    "my-favorites",
    "myPosts",
    "settings",
    "about",
    "404",
    "posts/[postId]",
  ],
  showCreatePost: [
    "",
    "posts",
    "my-favorites",
    "myPosts",
    "settings",
    "about",
    "posts/[postId]",
  ],
  showMyProfile: [
    "",
    "posts",
    "my-favorites",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "posts/[postId]",
    "posts/edit/[postId]",
    "404",
  ],
  showLogOut: [
    "",
    "posts",
    "my-favorites",
    "myPosts",
    "settings",
    "createPost",
    "about",
    "posts/[postId]",
    "posts/edit/[postId]",
    "404",
  ],
  showLogIn: [
    "",
    "registration",
    "about",
    "posts",
    "reset-password",
    "posts/[postId]",
    "404",
  ],
  showSignUp: [
    "",
    "signin",
    "about",
    "posts",
    "reset-password",
    "posts/[postId]",
  ],
};

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [hasChildren, setHasChildren] = useState(false);
  const router: NextRouter = useRouter();
  const url: Array<string> = router.route.split("/");
  const page: string = url.slice(1, url.length).join("/");
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [session]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const children = document.querySelector(".listElement")?.children || [];

    if (children.length > 0) {
      setHasChildren(true);
      return;
    }

    setHasChildren(false);
  }, [page]);

  return (
    <>
      <header className={styles.header} ref={ref}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <LibertyMeetsLogo />
          </Link>
          <div
            className={styles.burgerButton}
            onClick={() => setVisible(!visible)}
          >
            {hasChildren ? (
              <Image
                src={visible ? "/decor/close.svg" : "/decor/menu.svg"}
                alt=""
                width={60}
                height={60}
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className={visible ? styles.visible : styles.navigation}>
          {isLogin ? (
            <ul
              className={`${styles.navigationItemContainer} listElement`}
              onClick={(e) => setVisible(false)}
            >
              {buttonMap.showSearch.indexOf(page) !== -1 && (
                <SearchOpportunities />
              )}
              {buttonMap.showCreatePost.indexOf(page) !== -1 && <CreatePost />}
              {buttonMap.showMyProfile.indexOf(page) !== -1 && <MyProfile />}
              {buttonMap.showLogOut.indexOf(page) !== -1 && <LogOut />}
            </ul>
          ) : (
            <ul
              className={`${styles.navigationItemContainer} listElement`}
              onClick={(e) => setVisible(false)}
            >
              {buttonMap.showSearch.indexOf(page) !== -1 && (
                <SearchOpportunities />
              )}
              {buttonMap.showSignUp.indexOf(page) !== -1 && <SignUp />}
              {buttonMap.showLogIn.indexOf(page) !== -1 && <LogIn />}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
