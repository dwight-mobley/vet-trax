import LoginRegisterForm from "@/components/forms/LoginRegisterForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center  bg-background bg-hero bg-contain bg-no-repeat bg-center p-3">
      <Suspense fallback={"Loading Login Form"}>
        <LoginRegisterForm />
      </Suspense>
    </div>
  );
}
