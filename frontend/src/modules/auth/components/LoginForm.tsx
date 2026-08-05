import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack, Text } from "@chakra-ui/react";
import { LuMail, LuLock } from "react-icons/lu";
import { useLogin } from "@fe/modules/auth/hooks/useLogin";
import { validateEmail, normalizeEmail } from "@fe/utils/emailUtils";
import { submitOnEnter } from "@fe/utils/submitOnEnterUtil";
import { AuthHeader } from "@fe/modules/auth/components/AuthHeader";
import { AuthInput } from "@fe/modules/auth/components/AuthInput";
import { AuthPasswordInput } from "@fe/modules/auth/components/AuthPasswordInput";
import { AuthButton } from "@fe/modules/auth/components/AuthButton";

export default function LoginForm() {
  const navigator = useNavigate();
  const navigateToMain = () => {
    navigator("/");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, login, errorMessage, clearErrors } = useLogin({
    onSuccess: navigateToMain,
  });

  const invalidEmailMessage = (): string => {
    return validateEmail(email);
  };

  return (
    <VStack gap={6} align="stretch">
      <AuthHeader title="Login" subtitle="Welcome back!" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(email, password);
        }}
      >
        <VStack gap={4} align="stretch">
          <AuthInput
            label="Email Address"
            icon={<LuMail />}
            type="email"
            placeholder="you@example.com"
            value={email}
            error={invalidEmailMessage() || !!errorMessage}
            onChange={(val) => {
              setEmail(normalizeEmail(val));
              clearErrors();
            }}
            onKeyDown={(e) => submitOnEnter(e, () => login(email, password))}
          />

          <AuthPasswordInput
            label="Password"
            icon={<LuLock />}
            value={password}
            errors={!!errorMessage}
            onChange={(val) => {
              setPassword(val);
              clearErrors();
            }}
            onKeyDown={(e) => submitOnEnter(e, () => login(email, password))}
          />

          {errorMessage && (
            <Text color="red.500" fontSize="sm" textAlign="center" mt={-2}>
              {errorMessage}
            </Text>
          )}

          <AuthButton
            loading={isLoading}
            disabled={!email || !password || invalidEmailMessage().length > 0}
            onClick={() => login(email, password)}
          >
            Log In
          </AuthButton>
        </VStack>
      </form>
    </VStack>
  );
}
