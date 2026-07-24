import { PasswordInput } from "@/components/ui/password-input";
import { Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { useState } from "react";
import { normalizeEmail } from "@/utils/emailUtils";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "@/components/auth/screens/SignUpScreen/hooks/useRegistration";
import { useAuthValidation } from "@/components/auth/hooks/useAuthValidation";

export default function SignUpForm() {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/collection");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const { register, isLoading } = useRegistration({
    email,
    password,
    onSuccess: navigateToHome,
  });
  const { emailStatus, passwordStatus, confirmedPasswordStatus } =
    useAuthValidation({ email, password, confirmedPassword });

  return (
    <Fieldset.Root width="400px">
      <Fieldset.Legend>Sign Up Form</Fieldset.Legend>

      <form onSubmit={(e) => {
        e.preventDefault();
        register();
      }}>
      <Fieldset.Content>
        <Field.Root required invalid={!emailStatus.isEmailValid}>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            name="email"
            type="email"
            onChange={(e) => setEmail(normalizeEmail(e.target.value))}
          />
          <Field.ErrorText>{emailStatus.invalidEmailReason}</Field.ErrorText>
        </Field.Root>

        <Field.Root required invalid={!passwordStatus.isPasswordValid}>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordStatus.invalidPasswordReasons?.map((reason, index) => (
            <Field.ErrorText key={index}>{reason}</Field.ErrorText>
          ))}
        </Field.Root>

        <Field.Root
          required
          invalid={!confirmedPasswordStatus.isConfirmedPasswordValid}
        >
          <Field.Label>
            Confirm password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
            name="repeatPassword"
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <Field.ErrorText>
            {confirmedPasswordStatus.invalidconfPasswordReasons}
          </Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          loading={isLoading}
          disabled={
            !email ||
            !password ||
            !confirmedPassword ||
            !emailStatus.isEmailValid ||
            !passwordStatus.isPasswordValid ||
            !confirmedPasswordStatus.isConfirmedPasswordValid
          }
        >
          Sign Up
        </Button>
      </Fieldset.Content>
      </form>
    </Fieldset.Root>
  );
}
