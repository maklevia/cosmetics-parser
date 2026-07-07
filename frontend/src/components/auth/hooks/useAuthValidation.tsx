import { validateEmail } from "@/utils/email/validateEmail";
import { confirmPasswordMatch } from "@/utils/password/checkPasswordMatch";
import { validatePassword } from "@/utils/password/validatePassword";

interface EmailStatus {
  isEmailValid: boolean;
  invalidEmailReason?: string;
}
interface PasswordStatus {
  isPasswordValid: boolean;
  invalidPasswordReasons?: string[];
}
interface ConfirmedPasswordStatus {
  isConfirmedPasswordValid: boolean;
  invalidconfPasswordReasons: string;
}
interface HookInput {
  email: string;
  password: string;
  confirmedPassword: string;
}
interface HookOutput {
  emailStatus: EmailStatus;
  passwordStatus: PasswordStatus;
  confirmedPasswordStatus: ConfirmedPasswordStatus;
}

export const useAuthValidation = (options: HookInput): HookOutput => {
  const { email, password, confirmedPassword } = options;

  //if empty string returned - success, no invalidation reason
  const validateEmailMessage: string = validateEmail(email);
  const validatePasswordMessage: string[] = validatePassword(password);
  const validateConfirmPasswordMessage: string = confirmPasswordMatch(
    password,
    confirmedPassword,
  );

  const emailStatus: EmailStatus = {
    isEmailValid: !validateEmailMessage,
    invalidEmailReason: validateEmailMessage,
  };
  const isPasswordValid = validatePasswordMessage.length === 0;

  const passwordStatus: PasswordStatus = {
    isPasswordValid: isPasswordValid,
    invalidPasswordReasons: isPasswordValid ? undefined : validatePasswordMessage,
  };
  const confirmedPasswordStatus: ConfirmedPasswordStatus = {
    isConfirmedPasswordValid: !validateConfirmPasswordMessage,
    invalidconfPasswordReasons: validateConfirmPasswordMessage,
  };
  return {
    emailStatus,
    passwordStatus,
    confirmedPasswordStatus,
  };
};
