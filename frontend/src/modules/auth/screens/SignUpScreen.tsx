import AuthLayout from "@fe/modules/auth/layouts/AuthLayout";
import SignUpForm from "@fe/modules/auth/components/SignUpForm";
import { AuthFooter } from "@fe/modules/auth/components/AuthFooter";

export default function RegisterScreen() {
  return (
    <AuthLayout>
      <SignUpForm />
      <AuthFooter 
          text="Already have an account?" 
          linkText="Log In" 
          href="/login" 
      />
    </AuthLayout>
  );
}
