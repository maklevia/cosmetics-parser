import { PasswordInput } from "@/components/ui/password-input";
import { Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { useState } from "react";
import api from "@/api";
import { normalizeEmail } from "@/utils/email/normalizeEmail";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/email/validateEmail";
import { validatePassword } from "@/utils/password/validatePassword";
import { confirmPasswordMatch } from "@/utils/password/checkPasswordMatch";
import type { Errors } from "@/components/auth/screens/SignUpScreen/types/errors";

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const navigate = useNavigate();

  async function handleSubmit(): Promise<void> {
    const normalizedEmail: string = normalizeEmail(email);
    const validateEmailMessage: string | null = validateEmail(normalizedEmail);
    const validatePasswordMessage: string | null = validatePassword(password);
    const validateConfirmPasswordMessage: string | null = confirmPasswordMatch(password, confirmedPassword);
    const errors: Errors = {};

    if (validateEmailMessage) {
      errors.email = validateEmailMessage;
    }
    if (validatePasswordMessage) {
      errors.password = validatePasswordMessage;
    }
    if (validateConfirmPasswordMessage) {
      errors.confirmPassword = validateConfirmPasswordMessage;
    }

    //alert will be replaced with proper UI
    if(Object.keys(errors).length > 0) {
      alert(Object.values(errors));
      return;
    }
    try {
      const response = await api.post(
        "/auth/signup",
        {
          email: normalizedEmail,
          password: password,
        },
        {
          validateStatus: (status) => {
            return status === 201 || status === 409;
          },
        },
      );

      if (response.status === 201) {
        navigate("/main");
        console.log("Responce from API: ", response.data);
      } else if (response.status === 409) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("FE: error sign up ", error);
    }
  }

  return (
    <Fieldset.Root>
      <Fieldset.Legend>Sign Up Form</Fieldset.Legend>

      <Fieldset.Content>
        <Field.Root required>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Confirm password <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput
          name="repeatPassword"
          onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </Field.Root>

        <Button type="submit" onClick={handleSubmit}>
          Sign Up
        </Button>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
