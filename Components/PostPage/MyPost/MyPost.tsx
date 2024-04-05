import Image from "next/image";
import { Button, Select, Tooltip, Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import { Spiner } from "../../General/Spiner/Spiner";
import Location from "../../Location/Location";
import styles from "./MyPost.module.scss";
import { changeTitleByStatus } from "../../../utils/titleStatusUtils";
import { ExchangePostType, PostType } from "../../../types/general";
import { useSession } from "next-auth/react";

const { Option } = Select;

type PostProps = {
  session: Session | null;
  appUrl: string;
  post: ExchangePostType;
  fromUrl: string;
};
type ErrorResponse = {
  status: string;
};

const availableFromUrl = ["posts", "myPosts"];

export default function MyPost(props: PostProps) {
  const [post, setPost] = useState<PostType>(props.post as PostType);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const session = useSession();
  let appUrl = props.appUrl;
  if (props.fromUrl in availableFromUrl) {
    appUrl = "/posts";
  }
  const fromUrl = props.fromUrl;

  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../../Map"), {
        loading: () => <Spiner />,
        ssr: false,
      }),
    []
  );

  if (!post) {
    return null;
  }

  const coordinates = [post.lat, post.lng];

  const postId = post.id;

  async function makePublic(is_public: boolean) {
    try {
      const res = await axios.post(`${appUrl}/api/posts/updatePost`, {
        title: changeTitleByStatus(post, is_public),
        postId,
        is_public,
      });
      if (res.status === 200) {
        setPost({
          ...post,
          title: changeTitleByStatus(post, is_public),
          is_public,
        } as PostType);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete your post?",
      icon: <QuestionCircleOutlined />,
      content: "All information associated with post will also be deleted",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deletePost();
      },
    });
  };

  async function deletePost() {
    try {
      const res = await axios.post(`${appUrl}/api/posts/deletePost`, {
        postId,
      });
      if (res.status === 200) {
        router.push("/myPosts");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).status);
    }
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  async function changeStar(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);

    const is_favorite = res.data.data.isFavorite;

    setPost({ ...post, is_favorite });
  }

  return (
    <section className={styles.container}>
      <div className={styles.backBlock}>
        <Button
          className={styles.backButton}
          type="link"
          onClick={() => history.back()}
        >
          <Image
            src="/decor/arrow-left.svg"
            alt=""
            width={45}
            height={42}
            className={styles.backImage}
          />
          <span className={styles.backButtonText}>Back</span>
        </Button>
      </div>
      <div className={styles.myPostContainer}>
        {post.is_blocked && (
          <div className={styles.blockedPost}>
            <div className={styles.blockedWrapper}>
              <Image src="/decor/remember.svg" alt="" width={45} height={41} />
              <span className={styles.blockedTitle}>
                This post blocked by admin!
              </span>
            </div>
          </div>
        )}
        <Select
          value={"Edit"}
          dropdownMatchSelectWidth={false}
          showArrow={false}
          placement={"bottomRight"}
          className={styles.select}
          bordered={false}
        >
          <Option className={styles.optionContainer} key="edit">
            <Link href={`/posts/edit/${postId}/?fromUrl=${fromUrl}`}>
              <div className={styles.option}>
                <Image
                  src="/decor/editPensil.svg"
                  alt=""
                  width={14}
                  height={14}
                  className={styles.edit}
                />
                Edit
              </div>
            </Link>
          </Option>
          <Option className={styles.optionContainer} key="public">
            <div
              className={styles.option}
              onClick={async () => {
                makePublic(!post?.is_public);
              }}
            >
              <Image
                src="/decor/eye3.svg"
                alt=""
                width={16}
                height={16}
                className={styles.eye}
              />
              Make Post {post.is_public ? "Private" : "Public"}
            </div>
          </Option>
          <Option className={styles.optionContainer} key="delete">
            <div className={styles.option} onClick={showDeleteConfirm}>
              <Image
                src="/decor/trash.svg"
                alt=""
                width={14}
                height={16}
                className={styles.delete}
              />
              Delete
            </div>
          </Option>
        </Select>
        <div className={styles.topBlock}>
          {session.status === "authenticated" && (
            <div className={styles.star}>
              {post.favoriteUsers?.length > 0 || post.is_favorite ? (
                <div
                  onClick={() => {
                    changeStar(post.id);
                  }}
                >
                  <Image
                    src="/decor/starFaiv.svg"
                    alt=""
                    width={20}
                    height={20}
                    className={styles.starImage}
                  />
                </div>
              ) : (
                <div
                  onClick={() => {
                    changeStar(post.id);
                  }}
                >
                  <Image
                    src="/decor/starNoFaiv.svg"
                    alt=""
                    width={20}
                    height={20}
                    className={styles.starImage}
                  />
                </div>
              )}
            </div>
          )}
          <div className={styles.categoryBlock}>
            <div className={styles.categoryButton}>
              <div className={styles.categoryButtonText}>{post.category}</div>
            </div>
          </div>
          <div className={styles.titleBlock}>
            <span className={styles.titleText}>{post.title}</span>
          </div>
          <div className={styles.right}></div>
        </div>

        <div className={styles.postContent}>
          <div>
            <div className={styles.descriptionBlock}>
              <p className={styles.descriptionText}>{post.description}</p>
            </div>
            <div className={styles.publicity}>
              <div
                onClick={() => {
                  makePublic(!post.is_public);
                }}
              >
                {post.is_public ? (
                  <Image
                    src="/decor/eye5.svg"
                    alt=""
                    width={36}
                    height={36}
                    className={styles.publicityImage}
                  />
                ) : (
                  <Image
                    src="/decor/eye4.svg"
                    alt=""
                    width={36}
                    height={36}
                    className={styles.publicityImage}
                  />
                )}
              </div>
              <span
                className={
                  post.is_public ? styles.currentlyActive : styles.currently
                }
              >
                This Post Is Currently
              </span>
              <span
                className={post.is_public ? styles.publicActive : styles.public}
              >
                {post.is_public ? "Public" : "Private"}
              </span>

              <Tooltip
                trigger={"hover"}
                title={
                  "Setting this post to public allows anyone to see and reply to it."
                }
              >
                <Image
                  src="/decor/qwe.svg"
                  alt=""
                  width={36}
                  height={36}
                  className={styles.question}
                />
              </Tooltip>
            </div>
          </div>
          <div className={styles.cardBlock}>
            {coordinates && coordinates.length === 2 ? (
              <>
                <Location post={post} />
                <Map
                  appUrl={appUrl}
                  userLat={props.session?.user.lat}
                  userLng={props.session?.user.lng}
                  lat={Number(coordinates[0])}
                  lng={Number(coordinates[1])}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
