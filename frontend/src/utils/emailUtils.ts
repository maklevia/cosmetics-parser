import * as EmailValidator from "email-validator";

export function validateEmail(email: string): string {
  if (!EmailValidator.validate(email) && email) {
    return "Provide a valid email!";
  } else return "";
}

export function normalizeEmail(email: string): string {
    const normalizedEmail: string = email.trim().toLowerCase();
    return normalizedEmail;
}