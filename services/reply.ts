import { HttpError } from "../utils/HttpError";
import { getPost, isAuthorCheck } from "./posts";
import { createThread, createThreadMessage, getThread, storeSentMessageId } from "./threads";
import { sendReplyMessageToThread } from "./email";
import { Posts } from "../models/posts";
import { Threads } from "../models/threads";

export const handleReplyToPost = async (
  userId: number,
  post: Posts,
  message: string,
  isReceived: boolean = false,
  messageId: string = "",
) => {
  const postId = post.id;

  const isAuthor = await isAuthorCheck(userId, postId);

  let thread = await getThread(postId, userId);
  if (!thread) {
    if (isAuthor) {
      throw new HttpError(418, "author cannot start thread in his post");
    } else {
      thread = await createThread(postId, userId);
    }
  }

  await handleReplyToThread(userId, thread, message, isReceived, messageId);

  return true;
};

export async function handleReplyToThread(
  userId: number,
  thread: Threads,
  message: string,
  isReceived: boolean = false,
  messageId: string = "",
) {
  const post = await getPost(thread.post_id, undefined);
  const postId = post!.id;
  const isAuthor = await isAuthorCheck(userId, postId);

  // Check: only thread starter (stranger) OR post owner (author) can make reply
  if (!isAuthor && userId !== thread.user_id) {
    throw new HttpError(403, "Forbidden");
  }

  const threadMessage = await createThreadMessage(thread!.id, userId, message, isReceived, messageId);

  const sentMessageId = isAuthor
    ? await sendReplyMessageToThread(thread.user_id, message, thread)
    : await sendReplyMessageToThread(post!.author_id, message, thread);

  if (sentMessageId) {
    await storeSentMessageId(threadMessage.id, sentMessageId);
  }
}
