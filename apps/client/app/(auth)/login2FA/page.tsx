"use client";

import { InputOTPForm } from "@/components/auth/login-2FA-form";
import { AuthContext } from "@/providers/auth-provider";
import { LoginUserDTO } from "@event-planner/shared";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

const Login2FAPage = () => {
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);
  if (!authContext) return;
  const { login } = authContext;
  const email = searchParams.get("email");
  if (!email) {
    return (
      <div className="p-4 text-center">
        Invalid 2FA login link. Missing email parameter.
      </div>
    );
  }

  const handleSubmit = async (payload: LoginUserDTO) => {
    try {
      const { message } = await login(payload);
      toast.success(message);
    } catch (error) {
      console.error("2FA login error:", error);
    }
  };
  return (
    <div>
      <InputOTPForm onSubmit={handleSubmit} email={email} />
    </div>
  );
};

export default Login2FAPage;
