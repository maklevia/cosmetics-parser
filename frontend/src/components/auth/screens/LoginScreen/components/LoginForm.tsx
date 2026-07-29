import { useLogin } from "@fe/components/auth/screens/LoginScreen/hooks/useLogin";
import { PasswordInput } from "@fe/components/ui/password-input";
import { validateEmail, normalizeEmail } from "@fe/utils/emailUtils";
import { Fieldset, Field, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
   const nagivator = useNavigate();
  const navigateToMain = () => {
    nagivator('/collection');
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isLoading, login, errorMessage, clearErrors} = useLogin({email, password, onSuccess: navigateToMain});

  const invalidEmailMessage = (): string => {
    return validateEmail(email)
  }

  return (
    <Fieldset.Root width='400px' invalid={errorMessage.length > 0}>
      <Fieldset.Legend>Log In</Fieldset.Legend>
      <Fieldset.Content>
        <Field.Root required invalid={errorMessage.length > 0 || invalidEmailMessage().length > 0}>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            name="email"
            type="email"
            onChange={(e) => {
              setEmail(normalizeEmail(e.target.value));
              clearErrors();
            }}
          />
          <Field.ErrorText>{invalidEmailMessage()}</Field.ErrorText>
          
        </Field.Root>

        <Field.Root required invalid={errorMessage.length > 0}>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput onChange={(e) => {
            setPassword(e.target.value);
            clearErrors();
          }} />
        </Field.Root>

        <Button 
        type="submit" 
        loading={isLoading} 
        onClick={login}
        disabled={!email || !password}
        >
          Log In
        </Button>

        <Fieldset.ErrorText>{errorMessage}</Fieldset.ErrorText>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
