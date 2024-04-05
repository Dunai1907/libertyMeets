import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { changePostVisible } from "../../../services/posts";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";

type Payload = {};

type BodyType = {
  title: string;
  postId: number;
  is_public: boolean;
};

connect();

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
    const { title, postId, is_public } = body;

    await changePostVisible(session.user.id, title, postId, is_public);

    res.status(200).json({ status: "ok", data: {} });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
