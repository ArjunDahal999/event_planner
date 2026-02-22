// app/(auth)/register/page.tsx
"use client";
import {
  RegisterForm,
  type RegisterFormValues,
} from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // or your toast lib

const RegisterPage = () => {
  const [activationLink, setActivationLink] = useState<string>();
  const handleRegister = async (payload: RegisterFormValues) => {
    try {
      const { message, data } = await authService().register(payload);
      toast.success(message);
      setActivationLink(data.activationLink);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <RegisterForm
        className="min-w-sm md:min-w-lg"
        onSubmit={handleRegister}
      />
      {activationLink && (
        <Card className="w-full max-w-sm md:min-w-lg px-2">
          <span className="text-sm text-muted-foreground">
            For testing purposes, use the link below to activate your account.
            In a production environment, this link would be sent to the
            user&apos;s email address.
          </span>
          <Link className=" text-primary" href={activationLink}>
            {activationLink}
          </Link>
        </Card>
      )}
    </>
  );
};

export default RegisterPage;
