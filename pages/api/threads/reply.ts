import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import {
  handleReplyToPost,
  handleReplyToThread,
} from "../../../services/reply";
import { getPost } from "../../../services/posts";
import { getThreadById } from "../../../services/threads";
import { CommonApiResponse } from "../../../types/general";

type Payload = {};

type QueryType = {
  postId: number | undefined;
  threadId: string | undefined;
};

type BodyType = {
  message: string;
};

connect();

// Terminology:
// userId - any user
// author = post owner, postId
// stranger = thread starter

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }
    req.log.debug({ body: req.body }, "Request.body");

    let { message } = req.body as BodyType;
    if (!message) {
      throw new HttpError(400, "no message");
    }
    if (message.trim().length === 0) {
      throw new HttpError(400, "empty message");
    }

    const session = await getSession({ req });
    if (!session) {
      throw new HttpError(401, "Unauthorized");
    }
    const userId = Number(session?.user.id);

    let { postId, threadId } = req.query as QueryType;
    if (threadId) {
      const thread = await getThreadById(threadId);

      if (!thread) {
        throw new HttpError(404, "thread not found");
      }

      await handleReplyToThread(userId, thread, message);
    } else if (postId) {
      postId = Number(postId);
      if (isNaN(postId)) {
        throw new HttpError(400, "invalid postId");
      }

      const post = await getPost(postId, userId);
      if (!post) {
        res.status(404);
        return;
      }

      await handleReplyToPost(userId, post, message, false, "");
    } else {
      throw new HttpError(400, "invalid query");
    }

    res.status(200).json({ status: "ok", data: {} });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
}
