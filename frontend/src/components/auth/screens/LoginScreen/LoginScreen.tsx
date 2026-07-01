import AuthLayout from "@/components/auth/layouts/AuthLayout";
import LoginFooter from "@/components/auth/screens/LoginScreen/components/LoginFooter";
import LoginForm from "@/components/auth/screens/LoginScreen/components/LoginForm";

export default function LoginScreen() {
  return (
    <AuthLayout>
        <LoginForm />
        <LoginFooter />
    </AuthLayout>
  );
}
