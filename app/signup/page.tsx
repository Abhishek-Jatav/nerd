import { Suspense } from "react";
import SignupForm from "./SignupClient";

export default function SignupPage() {
  return (
    <Suspense
      fallback={<p className="text-white text-center">Loading form...</p>}>
      <SignupForm />
    </Suspense>
  );
}
