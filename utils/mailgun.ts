import config from "config";
import ejs from "ejs";
import Mailgun from "mailgun-js";

const mailgun = Mailgun({
  apiKey: config.get<string>("mailgun.apiKey"),
  domain: config.get<string>("mailgun.domain"),
  host: config.get<string>("mailgun.host"),
});

type RecipientType = { name?: string; email: string };

function resolveRecipientName(user: RecipientType) {
  return user.name ? `"${user.name}" <${user.email}>` : user.email;
}

function concatRecipients(list: RecipientType[]) {
  return (list || []).map(resolveRecipientName).join(", ");
}

async function renderEmailTemplate(ejsFileName: string, params: any) {
  console.log("params", params);
  const htmlFile = `${process.cwd()}${config.get(
    "emails.templatesDir"
  )}/${ejsFileName}.ejs`;
  const result = await ejs.renderFile(htmlFile, params);

  return result as string;
}

type ParamsType = {
  to: RecipientType;
  reply_to?: RecipientType;
};

const props = config.get<{
  from: RecipientType;
  cc: RecipientType[];
  bcc: RecipientType[];
  reply_to: RecipientType;
}>("emails.emailProps");

type HeadersSetupEntry = [string, string];
type HeadersSetup = Array<HeadersSetupEntry>;

export async function sendEmail(
  template: string,
  paramsArg: ParamsType,
  templateProps: any,
  headers: HeadersSetup = []
) {
  const params = { ...props, ...paramsArg };

  const subject = await renderEmailTemplate(
    `${template}/subject`,
    templateProps
  );

  const rawBody = await renderEmailTemplate(`${template}/body`, templateProps);
  const body = rawBody.trim();

  const data: any = {
    from: resolveRecipientName(params.from),
    subject: subject || "",
    html: body,
  };

  let isRecipientsFound = false;
  if (params.to) {
    data.to = Array.isArray(params.to)
      ? concatRecipients(params.to)
      : concatRecipients([params.to]);
    isRecipientsFound = true;
  }
  if (params.cc) {
    data.cc = concatRecipients(params.cc);
    isRecipientsFound = true;
  }
  if (params.bcc) {
    data.bcc = concatRecipients(params.bcc);
    isRecipientsFound = true;
  }
  if (params.reply_to) {
    data["h:Reply-To"] = resolveRecipientName(params.reply_to);
  } else {
    data["h:Reply-To"] = params.from.email;
  }

  headers.forEach(([header, value]) => {
    data[`h:${header}`] = value;
  });

  if (!isRecipientsFound) {
    throw new Error("Recipients not found");
  }

  console.log("data", data);
  const res = await mailgun.messages().send(data);
  console.log("result", res);
  return res;
}
