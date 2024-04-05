import type { NextApiRequest, NextApiResponse } from "next";
import { getFavoritePosts } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { getSession } from "next-auth/react";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";
import { Posts } from "../../../models/posts";

type Payload = {
  posts: Posts[];
  count: number;
};

type QueryType = {
  page: number | undefined;
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

    let { page } = req.query as QueryType;
    if (!page) {
      page = 1;
    }

    const session = await getSession({ req });
    if (!session || !session.user) {
      res.status(401);
      return;
    }

    const { posts, count } = await getFavoritePosts(page, session.user);
    res.status(200).json({ status: "ok", data: { posts, count } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
