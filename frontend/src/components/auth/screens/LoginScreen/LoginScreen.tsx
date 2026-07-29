import AuthLayout from "@fe/components/auth/layouts/AuthLayout";
import LoginFooter from "@fe/components/auth/screens/LoginScreen/components/LoginFooter";
import LoginForm from "@fe/components/auth/screens/LoginScreen/components/LoginForm";

export default function LoginScreen() {
  return (
    <AuthLayout>
        <LoginForm />
        <LoginFooter />
    </AuthLayout>
  );
}
