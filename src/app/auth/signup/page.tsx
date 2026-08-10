import { Suspense } from "react";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-muted">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
