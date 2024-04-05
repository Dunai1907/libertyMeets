import type { NextApiRequest, NextApiResponse } from "next";
import { changePassword } from "../../../services/users";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { errorResponse } from "../../../utils/response";

type Payload = {
  message: string;
};

type BodyType = {
  token: string;
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
    req.log.debug({ body: req.body }, "Request.body");

    const { token, password } = req.body as BodyType;

    if (!token) {
      throw new HttpError(400, "Invalid token");
    }
    if (!password) {
      throw new HttpError(400, "Invalid password");
    }

    const isUser = await changePassword(password, token);

    if (!isUser) {
      req.log.warn({ token }, "Attempt to update password but token not found");
      res
        .status(204)
        .json({ status: "ok", data: { message: "Invalid token" } });
      return;
    }

    res
      .status(200)
      .json({ status: "ok", data: { message: "success reset password" } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
