import collection from "../../collection.config.js";
import ResetPasswordForm from "../../components/ResetPasswordForm.js";

export const metadata = {
  title: `Reset password — ${collection.name}`,
};

// Landing page for the "forgot password" email link. The token in the URL is
// exchanged and the new password chosen entirely in the client form below.
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}