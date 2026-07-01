import AuthLayout from "@/components/auth/layouts/AuthLayout";
import SignUpFooter from "@/components/auth/screens/SignUpScreen/components/SignUpFooter";
import SignUpForm from "@/components/auth/screens/SignUpScreen/components/SignUpForm";

export default function RegisterScreen() {
  return (
    <AuthLayout>
      <SignUpForm />
      <SignUpFooter />
    </AuthLayout>
  );
}
