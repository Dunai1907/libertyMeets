import type { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationByEmail } from "../../../services/email";
import { getEmailVerificationToken } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = {
  message: string;
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

    const email_verification_token = await getEmailVerificationToken(email);
    if (!email_verification_token) {
      throw new HttpError(400, "no email_verification_token");
    }
    const url = process.env.NEXTAUTH_URL;
    if (!url) {
      throw new HttpError(404, "Web site not found");
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/account/verification/${email_verification_token}`;
    const supportEmail = config.get<string>("emails.supportEmail");

    await sendVerificationByEmail(email, verificationUrl, supportEmail);
    res.status(200).json({ status: "ok", data: { message: "success resend" } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
