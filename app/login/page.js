import AuthForm from "../../components/AuthForm.js";

export const metadata = {
  title: "Sign in — Khmer Living Archive",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}