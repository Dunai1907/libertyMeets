import type { NextApiRequest, NextApiResponse } from "next";
import {
  changePasswordByUserId,
  isPasswordUsed,
} from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { getSession } from "next-auth/react";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = {};

type BodyType = {
  password: string;
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

    const { password } = req.body as BodyType;

    if (!password) {
      throw new HttpError(400, "no password");
    }

    const session = await getSession({ req });

    if (!session) {
      throw new HttpError(400, "user does not valid");
    }

    const isUsedPassword = await isPasswordUsed(
      session.user.id as number,
      password
    );

    if (isUsedPassword) {
      throw new HttpError(400, "password used");
    }

    await changePasswordByUserId(session.user.id as number, password);
    res.status(200).json({ status: "ok", data: {} });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
