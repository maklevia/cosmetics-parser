import api from "@/api";
import { PasswordInput } from "@/components/ui/password-input";
import { normalizeEmail } from "@/utils/email/normalizeEmail";
import { Fieldset, Field, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nagivator = useNavigate();

  async function handleSubmit(): Promise<void> {
    const normalizedEmail: string = normalizeEmail(email);
    
    if(!email) {
      alert('Enter email!');
    }
    if(!password){
      alert('Enter password!');
    }

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: normalizedEmail,
          enteredPassword: password,
        },
        {
          validateStatus: (status) => {
            return status === 401 || status === 200;
          },
        },
      );

      if (response.status === 401) {
        alert('Email or password are not correct!')
        return;
      }
      nagivator('/main');
    } catch (error) {
      console.log("FE: error while user log in: ", error);
    }
  }

  return (
    <Fieldset.Root>
      <Fieldset.Legend>Log In</Fieldset.Legend>
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
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </Field.Root>

        <Button type="submit" onClick={handleSubmit}>
          Log In
        </Button>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
