import AuthLayout from "@fe/modules/auth/layouts/AuthLayout";
import LoginForm from "@fe/modules/auth/components/LoginForm";
import { AuthFooter } from "@fe/modules/auth/components/AuthFooter";

export default function LoginScreen() {
  return (
    <AuthLayout>
        <LoginForm />
        <AuthFooter 
          text="Don't have an account?" 
          linkText="Sign Up" 
          href="/signup" 
        />
    </AuthLayout>
  );
}
