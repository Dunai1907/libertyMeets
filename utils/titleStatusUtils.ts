import { PostType } from "../types/general";

function addingPostTitle(post: PostType) {
  return post.title.trim().toLowerCase().startsWith("draft:")
    ? post.title
    : `Draft: ${post.title}`;
}

export function checkPostTitile(title: string) {
  return title.trim().toLowerCase().startsWith("draft:")
    ? title
    : `Draft: ${title}`;
}

export function changeTitleByStatus(post: PostType, is_public: boolean) {
  return is_public ? post.title.slice(7) : addingPostTitle(post);
}

export function isDraft(title: string): boolean {
  return title.trim().toLowerCase().startsWith("draft:");
}
