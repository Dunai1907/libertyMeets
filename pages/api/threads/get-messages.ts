import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import {
  getMessages,
  getThread,
  getThreads,
  isUserCanView,
} from "../../../services/threads";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";
import { ThreadMessages } from "../../../models/threadMessages";

type Payload = {
  messages: ThreadMessages[];
};

type QueryThread = { threadId: string | undefined };
type QueryPostUser = {
  postId: string | undefined;
  threadUserId: string | undefined;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    let threadId;

    const threadQuery = req.query as QueryThread;
    const postUserQuery = req.query as QueryPostUser;
    if (threadQuery?.threadId) {
      threadId = threadQuery.threadId;
    } else if (postUserQuery.postId && postUserQuery.threadUserId) {
      const thread = await getThread(
        +postUserQuery.postId,
        +postUserQuery.threadUserId
      );
      threadId = thread?.id;
    } else {
      throw new HttpError(400, "invalid query");
    }

    if (!threadId) {
      throw new HttpError(400, "no threadId");
    }

    const userId = session.user.id;
    const isCanView = isUserCanView(threadId, userId);
    if (!isCanView) {
      res.status(403);
      return;
    }

    const messages = await getMessages(threadId);
    res.status(200).json({ status: "ok", data: { messages: messages } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
