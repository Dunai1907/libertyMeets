import axios from "axios";
import config from "config";

const RECAPTCHA_SECRET_KEY = config.get<string>("recaptcha.recaptcha_key");

export async function Siteverify(recaptchaValue: string) {
  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`
  );

  return res.data.success;
}
