import type { NextApiRequest, NextApiResponse } from "next";
import config from "config";
import { getPosts } from "../../services/posts";
import { getSession } from "next-auth/react";
import { connect } from "../../utils/db";
import { errorResponse } from "../../utils/response";
import { CommonApiResponse } from "../../types/general";
import { Posts } from "../../models/posts";

type Payload = {
  posts: Posts[];
  count: number;
};

type QueryType = {
  page: number | undefined;
  category: string | undefined;
};

connect();
const APP_URL = config.get<string>("appUrl");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { page, category } = req.query as QueryType;
    if (!page) {
      page = 1;
    }

    if (category === "All") category = undefined;

    const session = await getSession({ req });

    const { posts, count } = (await getPosts(session?.user, {
      page,
      category,
    })) || { posts: [], count: 0 };
    res.status(200).json({ status: "ok", data: { posts, count } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
