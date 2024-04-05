import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { editPost, isAuthorCheck } from "../../../services/posts";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { errorResponse } from "../../../utils/response";

type Payload = {
  postId: number;
};

type BodyType = {
  id: number;
  title: string;
  category: string;
  description: string;
};

connect();

const CATEGORIES = ["Social", "Volunteer", "Professional", "Campaigns"];

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

    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }

    const body = req.body as BodyType;
    const { id, title, category, description } = body;

    const isAuthor = await isAuthorCheck(session.user?.id, id);
    if (!isAuthor) {
      res.status(403);
      return;
    }

    if (!title || !category || !description) {
      throw new HttpError(400, "invalid body structure");
    }

    if (title.length < 4 || title.length > 100) {
      throw new HttpError(400, "invalid title length");
    }

    if (!CATEGORIES.includes(category)) {
      throw new HttpError(400, "invalid category");
    }

    if (description.length < 4 || description.length > 1024) {
      throw new HttpError(400, "invalid description length");
    }

    const post = await editPost(id, title, category, description);
    res.status(200).json({ status: "ok", data: { postId: id } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
