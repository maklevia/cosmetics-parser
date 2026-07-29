import AuthLayout from "@fe/components/auth/layouts/AuthLayout";
import SignUpFooter from "@fe/components/auth/screens/SignUpScreen/components/SignUpFooter";
import SignUpForm from "@fe/components/auth/screens/SignUpScreen/components/SignUpForm";

export default function RegisterScreen() {
  return (
    <AuthLayout>
      <SignUpForm />
      <SignUpFooter />
    </AuthLayout>
  );
}
