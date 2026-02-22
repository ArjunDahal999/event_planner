// app/(auth)/register/page.tsx
"use client";
import {
  RegisterForm,
  type RegisterFormValues,
} from "@/components/auth/register-form";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your toast lib

const RegisterPage = () => {
  const router = useRouter();

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      await authService().register(data);
      toast.success("Account created! Please sign in.");
      router.push("/activate");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <RegisterForm className="min-w-sm md:min-w-lg" onSubmit={handleRegister} />
  );
};

export default RegisterPage;
