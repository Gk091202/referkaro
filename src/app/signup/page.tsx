import { Suspense } from "react";
import { LoadingPage } from "@/components/ui";
import { SignupContent } from "./SignupContent";

export const metadata = {
  title: "Sign Up - referkaro",
  description: "Create your referkaro account.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading..." />}>
      <SignupContent />
    </Suspense>
  );
}
