import { PostType } from "../types/general";
import { useRouter } from "next/router";

type PostListItemProps = {
  post: PostType;
  appUrl: string;
  changeStar: (postId: number) => void;
};

export default function PostListItem(props: PostListItemProps) {
  const { post, appUrl, changeStar } = props;
  const router = useRouter();

  const goToPostPage = (post_id: number) => {
    router.push(`${appUrl}/posts/${post_id}`);
  };

  return (
    <>
      {post.favoriteUsers?.length > 0 || post.is_favorite ? (
        <div
          onClick={() => {
            changeStar(post.id);
          }}
        >
          star{" "}
        </div>
      ) : (
        <div
          onClick={() => {
            changeStar(post.id);
          }}
        >
          no star
        </div>
      )}
      <div onClick={() => goToPostPage(post.id)}>
        <p>{post.category}</p>
        <p>{post.title}</p>
        <p>{(post.lat, post.lng)}</p>
        <p>{post.created_at.toString()}</p>
        <hr />
      </div>
    </>
  );
}
