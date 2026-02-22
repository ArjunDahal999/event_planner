"use client";
import { LoginForm } from "@/components/auth/login-form";
import { authService } from "@/services/auth.service";
import { Generate2FADTO } from "@event-planner/shared";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();

  const handleGenerate2FA = async (data: Generate2FADTO) => {
    try {
      await authService().generate2FA(data);
      toast.success("Account created! Please sign in.");
      router.push("/login2FA?email=" + encodeURIComponent(data.email));
    } catch (error: unknown) {
      console.error("2FA generation error:", error);
    }
  };
  return <LoginForm onSubmit={handleGenerate2FA} className=" min-w-lg" />;
};

export default LoginPage;
