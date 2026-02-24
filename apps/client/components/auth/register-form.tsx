// components/auth/register-form.tsx
"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { registerUserSchema } from "@event-planner/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export type RegisterFormValues = z.infer<typeof registerUserSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
}

const inputStyles =
  "w-full border border-gray-300 bg-white px-4 py-2 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50";

const labelStyles = "text-sm font-medium text-gray-700";

const errorStyles = "text-xs text-red-500 mt-1";

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="max-w-md mx-auto bg-white border shadow-sm p-8 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Register for an account
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your details below to create a new account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className={labelStyles}>Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Your Name"
            disabled={isSubmitting}
            className={inputStyles}
          />
          {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelStyles}>Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="m@example.com"
            disabled={isSubmitting}
            className={inputStyles}
          />
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className={labelStyles}>Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Your Password"
            disabled={isSubmitting}
            className={inputStyles}
          />
          {errors.password && (
            <p className={errorStyles}>{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full  bg-primary text-white font-medium py-3 rounded-lg shadow-md hover:shadow-none transition disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
