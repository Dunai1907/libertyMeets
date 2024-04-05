import { ThreadMessages } from "../models/threadMessages";
import { Threads } from "../models/threads";
import { HttpError } from "../utils/HttpError";
import { getPost } from "./posts";

export function getThreads(postId: number) {
  return Threads.findAll({ where: { post_id: postId } });
}

export function getThreadById(id: string) {
  return Threads.findOne({
    where: { id },
  });
}

export function getThread(postId: number, userId: number) {
  return Threads.findOne({
    where: { post_id: postId, user_id: userId },
  });
}

export async function isUserCanView(threadId: string, userId: number) {
  const foundThread = await Threads.findOne({
    where: { id: threadId },
    //include: { model: Posts, as: "post" },
  });
  if (!foundThread) {
    throw new HttpError(404, "thread not found");
  }
  const threadCreatorId = foundThread.user_id;

  const post = await getPost(foundThread.post_id, userId);
  const authorId = post!.author_id;

  return userId === threadCreatorId || userId === authorId;
}

export function getMessages(threadId: string) {
  return ThreadMessages.findAll({
    where: { thread_id: threadId },
  });
}

export function createThread(postId: number, userId: number) {
  const threadToSave = { user_id: userId, post_id: postId };
  return Threads.create(threadToSave);
}

export function createThreadMessage(
  threadId: string,
  userId: number,
  message: string,
  isReceived: boolean,
  messageId: string,
) {
  const toCreate = {
    thread_id: threadId,
    user_id: userId,
    message,
    sent_message_id: (!isReceived && messageId) ? messageId : undefined,
    received_message_id: (isReceived && messageId) ? messageId : undefined,
  };
  return ThreadMessages.create(toCreate);
}

export function storeSentMessageId(
  id: string,
  sentMessageId: string,
) {
  return ThreadMessages.update(
    { sent_message_id: sentMessageId },
    { where: { id } },
  );
}
