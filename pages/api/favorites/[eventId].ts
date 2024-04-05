import type { NextApiRequest, NextApiResponse } from "next";
import { changeFavoritePost } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { errorResponse } from "../../../utils/response";
import type { CommonApiResponse } from "../../../types/general"

type Payload = {
  postId: number;
  isFavorite: boolean;
};

type QueryType = { eventId: string };

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>,
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const query = req.query as QueryType;
    const postId = +query.eventId;

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const isFavorite = await changeFavoritePost(session.user.id, postId);
    res.status(200).json({ status: "ok", data: { postId, isFavorite } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
