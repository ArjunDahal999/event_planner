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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Generate2FADTO, generate2FASchema } from "@event-planner/shared";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface LoginFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  onSubmit: (data: Generate2FADTO) => Promise<void>;
}
export function LoginForm({ className, onSubmit, ...props }: LoginFormProps) {
  const form = useForm<z.infer<typeof generate2FASchema>>({
    resolver: zodResolver(generate2FASchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const FIELDS = [
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
  const { isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
