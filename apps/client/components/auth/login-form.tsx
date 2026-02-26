"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Generate2FADTO, generate2FASchema } from "@event-planner/shared";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
  onSubmit: (data: Generate2FADTO) => Promise<void>;
}

type LoginFormValues = z.infer<typeof generate2FASchema>;

const inputStyles =
  "w-full border border-gray-300 bg-white px-4 py-2 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50";

const labelStyles = "text-sm font-medium text-gray-700";

const errorStyles = "text-xs text-red-500 mt-1";

export function LoginForm({ onSubmit }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(generate2FASchema),
    defaultValues: {
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
        Login to your account
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your email below to login to your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            className="w-full bg-primary text-white font-medium py-3 rounded-lg shadow-md  hover:shadow-none transition disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Login"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
