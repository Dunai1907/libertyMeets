import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { deleteAccount } from "../../../services/users";
import { deleteUserPosts } from "../../../services/posts";
import { connect } from "../../../utils/db";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = {
  message: string;
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

    await (
      await sequelize
    ).transaction(async (t) => {
      const resDelPosts = await deleteUserPosts(session?.user.id as number, t);
      if (resDelPosts) {
        res
          .status(500)
          .json({ status: "error", data: { message: resDelPosts.message } });
        return;
      }

      const resDelAcc = await deleteAccount(session?.user.id as number, t);
      if (resDelAcc) {
        res
          .status(500)
          .json({ status: "error", data: { message: resDelAcc.message } });
        return;
      }
      res.status(200).json({ status: "ok", data: { message: "success" } });
    });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
