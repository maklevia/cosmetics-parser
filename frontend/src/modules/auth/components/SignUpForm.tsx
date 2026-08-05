import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack } from "@chakra-ui/react";
import { LuMail, LuLock, LuShieldCheck } from "react-icons/lu";
import { useRegistration } from "@fe/modules/auth/hooks/useRegistration";
import { validateEmail, normalizeEmail } from "@fe/utils/emailUtils";
import { validatePassword, confirmPasswordMatch } from "@fe/utils/passwordUtils";
import { submitOnEnter } from "@fe/utils/submitOnEnterUtil";
import { AuthHeader } from "@fe/modules/auth/components/AuthHeader";
import { AuthInput } from "@fe/modules/auth/components/AuthInput";
import { AuthPasswordInput } from "@fe/modules/auth/components/AuthPasswordInput";
import { AuthButton } from "@fe/modules/auth/components/AuthButton";

export default function SignUpForm() {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  
  const { register, isLoading } = useRegistration({
    onSuccess: navigateToHome,
  });

  const emailError = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const confirmPasswordError = confirmPasswordMatch(password, confirmedPassword);

  const isFormValid = 
    !!email && 
    !!password && 
    !!confirmedPassword && 
    !emailError && 
    passwordErrors.length === 0 && 
    !confirmPasswordError;

  return (
    <VStack gap={6} align="stretch">
      <AuthHeader title="Sign Up" subtitle="Create your account" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) register(email, password);
        }}
      >
        <VStack gap={4} align="stretch">
          <AuthInput
            label="Email Address"
            icon={<LuMail />}
            type="email"
            placeholder="you@example.com"
            value={email}
            error={emailError}
            onChange={(val) => setEmail(normalizeEmail(val))}
            onKeyDown={(e) => submitOnEnter(e, () => { if (isFormValid) register(email, password); })}
          />

          <AuthPasswordInput
            label="Password"
            icon={<LuLock />}
            value={password}
            errors={passwordErrors.length > 0 ? passwordErrors : null}
            onChange={(val) => setPassword(val)}
            onKeyDown={(e) => submitOnEnter(e, () => { if (isFormValid) register(email, password); })}
          />

          <AuthPasswordInput
            label="Confirm Password"
            icon={<LuShieldCheck />}
            value={confirmedPassword}
            errors={confirmPasswordError}
            onChange={(val) => setConfirmedPassword(val)}
            onKeyDown={(e) => submitOnEnter(e, () => { if (isFormValid) register(email, password); })}
          />

          <AuthButton
            loading={isLoading}
            disabled={!isFormValid}
            onClick={() => { if (isFormValid) register(email, password); }}
          >
            Sign Up
          </AuthButton>
        </VStack>
      </form>
    </VStack>
  );
}
