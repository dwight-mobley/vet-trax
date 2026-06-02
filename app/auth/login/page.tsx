import LoginRegisterForm from "@/components/forms/LoginRegisterForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-3  bg-gradient-to-r from-primary-light to-primary-dark">
      <Suspense fallback={"Loading Login Form"}>
        <LoginRegisterForm />
      </Suspense>
    </div>
  );
}
