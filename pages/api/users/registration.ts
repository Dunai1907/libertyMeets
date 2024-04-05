import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationByEmail } from "../../../services/email";
import { Siteverify } from "../../../services/recaptcha";
import { fillEmailToken, saveUserToDatabase } from "../../../services/users";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { validateEmail } from "../../../utils/stringUtils";
import config from "config";
import { Buffer } from "buffer";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = {
  message: string;
};

type BodyType = {
  email: string;
  password: string;
  recaptchaValue: string;
};

connect();

const v4 = (email: string): string => {
  return uuidv4() + Buffer.from(email).toString("hex");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const { email, password, recaptchaValue } = req.body as BodyType;

    if (!email) {
      throw new HttpError(400, "no email");
    }

    if (!password) {
      throw new HttpError(400, "no password");
    }

    if (!validateEmail(email)) {
      throw new HttpError(400, "invalid email");
    }

    const isSuccess = await Siteverify(recaptchaValue);

    if (!isSuccess) {
      throw new HttpError(422, "Invalid captcha code");
    }

    const email_verification_token = v4(email);
    await saveUserToDatabase({ email, password });
    await fillEmailToken(email, email_verification_token);

    const url = process.env.NEXTAUTH_URL;
    if (!url) {
      throw new HttpError(404, "Web site not found");
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/account/verification/${email_verification_token}`;
    const supportEmail = config.get<string>("emails.supportEmail");

    await sendVerificationByEmail(email, verificationUrl, supportEmail);
    res
      .status(200)
      .json({ status: "ok", data: { message: "success registration" } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
