import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { HttpError } from "../../../utils/HttpError";
import { isAuthorCheck } from "../../../services/posts";
import { getThreads } from "../../../services/threads";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";
import { Threads } from "../../../models/threads";

type Payload = {
  threads: Threads[];
};

type QueryType = {
  postId: number | undefined;
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

    let { postId } = req.query as QueryType;
    if (!postId) {
      throw new HttpError(400, "no postId");
    }

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const userId = session.user.id;
    const isAuthor = isAuthorCheck(userId, postId);
    if (!isAuthor) {
      res.status(403);
      return;
    }

    const threads = await getThreads(postId);
    res.status(200).json({ status: "ok", data: { threads } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
