// components/auth/register-form.tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { registerUserSchema } from "@event-planner/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export type RegisterFormValues = z.infer<typeof registerUserSchema>;

interface RegisterFormProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit"
> {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
}

const FIELDS = [
  {
    name: "name" as const,
    label: "Name",
    type: "text",
    placeholder: "Your Name",
  },
  {
    name: "email" as const,
    label: "Email",
    type: "email",
    placeholder: "m@example.com",
  },
  {
    name: "password" as const,
    label: "Password",
    type: "password",
    placeholder: "Your Password",
  },
];

export function RegisterForm({
  className,
  onSubmit,
  ...props
}: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register for an account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {FIELDS.map(({ name, label, type, placeholder }) => (
                <Controller
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={name}>{label}</FieldLabel>
                      <Input
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        disabled={isSubmitting}
                        aria-invalid={!!fieldState.error}
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              ))}
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
