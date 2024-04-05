import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { deletePost } from "../../../services/posts";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";

type Payload = { message?: string };

type BodyType = {
  postId: number;
};

const sequelize = connect();

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
    const { postId } = body;

    await (
      await sequelize
    ).transaction(async (t) => {
      const result = await deletePost(session.user.id, postId, t);
      if (result) {
        res
          .status(500)
          .json({ status: "error", data: { message: result.message } });
        return;
      }

      res.status(200).json({ status: "ok", data: {} });
    });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
