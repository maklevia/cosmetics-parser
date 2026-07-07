import * as EmailValidator from "email-validator";

export function validateEmail(email: string): string {
  if (!EmailValidator.validate(email) && email) {
    return "Provide a valid email!";
  } else return "";
}
