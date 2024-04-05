import { stripHtml } from "./html";

export const getTextMessageFromEmailPayload = async (payload: Record<string, string>) => {
  let message;

  if (payload['stripped-text']) {
    message = payload['stripped-text'];
    message = message.trim();
  }
  if (message) {
    return message;
  }

  if (payload['stripped-html']) {
    message = payload['stripped-html'];
    message = stripHtml(message);
    message = message.trim();
  }
  if (message) {
    return message;
  }

  if (payload['body-plain']) {
    message = payload['body-plain'];
    message = message.trim();
  }
  if (message) {
    return message;
  }

  if (payload['body-html']) {
    message = payload['body-html'];
    message = stripHtml(message);
    message = message.trim();
  }
  if (message) {
    return message;
  }

  return null;
};
