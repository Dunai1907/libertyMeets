import config from "config";
import { Threads } from "../models/threads";
import { HttpError } from "../utils/HttpError";
import { sendEmail } from "../utils/mailgun";
import { simpleTextToHtml } from "../utils/html";
import { getUser } from "./users";
import { getPost } from "./posts";

export async function sendReplyMessage(userId: number, message: string) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  await sendEmail(
    "reply",
    {
      to: {
        name: undefined,
        email: user.email,
      },
    },
    { message }
  );
}

export async function sendReplyMessageToThread(
  userId: number,
  message: string,
  thread: Threads
) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  const post = await getPost(thread.post_id, user.id);
  const title = post?.title;

  const baseDomain = config.get<string>("emails.replySetup.baseDomain");
  const replyTo = config.get<{ name: string; email: string }>("emails.emailProps.reply_to");

  const threadEmailAddress = `${thread.id}@${baseDomain}`;

  const result = await sendEmail(
    "reply",
    {
      to: {
        name: undefined,
        email: user.email,
      },
      reply_to: {
        ...replyTo,
        email: threadEmailAddress,
      },
    },
    { message: simpleTextToHtml(message), title },
    [
      ["In-Reply-To", `<${threadEmailAddress}>`],
      ["References", `<${threadEmailAddress}>`],
    ],
  );
  if (!result) {
    return null;
  }
  return result.id;
}

export async function sendResetPasswordLink(
  userId: number,
  resetUrl: string,
  supportEmail: string
) {
  const user = await getUser(userId);
  if (!user) {
    throw new HttpError(404, "user not found");
  }

  await sendEmail(
    "reset-password",
    {
      to: {
        name: undefined,
        email: user.email,
      },
    },
    { resetUrl, supportEmail }
  );
}

export async function sendVerificationByEmail(
  email: string,
  resetUrl: string,
  supportEmail: string
) {
  await sendEmail(
    "verification",
    {
      to: {
        name: undefined,
        email: email,
      },
    },
    { resetUrl, supportEmail }
  );
}
