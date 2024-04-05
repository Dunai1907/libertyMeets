import type { NextApiRequest, NextApiResponse } from "next";
import { fillToken, findUser } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { v4 } from "uuid";
import { sendResetPasswordLink } from "../../../services/email";
import config from "config";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = {
  message: string;
  token: string;
};

type BodyType = {
  email: string;
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

    const { email } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    const foundUser = await findUser(email);

    if (foundUser) {
      const reset_pwd_token = v4();
      await fillToken(email, reset_pwd_token);

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/verify/${reset_pwd_token}`;
      const supportEmail = config.get<string>("emails.supportEmail");

      await sendResetPasswordLink(foundUser.id, resetUrl, supportEmail);

      res.status(200).json({
        status: "ok",
        data: {
          message: "success create reset token",
          token: reset_pwd_token,
        },
      });

      return;
    }

    if (!foundUser) {
      throw new HttpError(404, "email is not exists");
    }
  } catch (err) {
    errorResponse(req, res, err);
  }
}
