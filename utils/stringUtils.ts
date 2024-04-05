import * as EmailValidator from "email-validator";

export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}
const pattern =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\"\<\>\$%\^&\*\`\~\+\_\‼\¿\¡\?\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?])[A-Za-z\d!@#\"\<\>\$%\^&\*\`\~\+\‼\¿\¡\_\?\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?]{8,}/;

export const PASSWORD_VALIDATION_PATTERN = new RegExp(pattern);

export function removeTagsFromEmail(email: string): string {
  if (!validateEmail(email)) {
    throw "Incorrect email format provided";
  }
  const emailParts = email.split(/[@+]/);
  return `${emailParts[0]}@${emailParts.at(-1)}`;
}
