import { ExchangePostType } from "../types/general";
import Event from "./Event/Event";

type PostListProps = {
  posts: ExchangePostType[];
  changeStar: (postId: number) => void;
  isViewForAllCategory: boolean;
  isLogin: boolean;
};

export default function PostsList(props: PostListProps) {
  const { posts, changeStar, isViewForAllCategory, isLogin } = props;

  return (
    <>
      {posts.map((post: ExchangePostType) => (
        <Event
          key={post.id}
          post={post}
          changeStar={changeStar}
          isViewForAllCategory={isViewForAllCategory}
          isLogin={isLogin}
        />
      ))}
    </>
  );
}
