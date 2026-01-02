import { Suspense } from "react";
import { LoadingPage } from "@/components/ui";
import { LoginContent } from "./LoginContent";

export const metadata = {
  title: "Sign In - referkaro",
  description: "Sign in to your referkaro account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading..." />}>
      <LoginContent />
    </Suspense>
  );
}
