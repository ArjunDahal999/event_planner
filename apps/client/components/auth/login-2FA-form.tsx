/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  LoginUserDTO,
  loginUserSchema,
} from "@event-planner/shared/src/schemas/user.schema";
import z from "zod";

interface InputOTPFormProps {
  onSubmit: (payload: LoginUserDTO) => Promise<void>;
  email: string;
}

type OTPFormValues = z.infer<typeof loginUserSchema>;

const inputStyles =
  "w-full border border-gray-300 bg-white px-4 py-3 text-center text-xl tracking-widest rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

const labelStyles = "text-sm font-medium text-gray-700";

const errorStyles = "text-xs text-red-500 mt-1";

const InputOTPForm = ({ onSubmit, email }: InputOTPFormProps) => {
  const form = useForm<OTPFormValues>({
    //@ts-ignore
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email,
      token: "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="max-w-md mx-auto bg-white border shadow-sm p-8 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Verify your login
      </h2>
      <p className="text-sm text-primary mb-6">
        Note:Check your terminal for the verification code; this will be sent to
        email in prod
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden Email Field */}
        <input type="hidden" {...register("email")} />

        {/* OTP Field */}
        <div>
          <label className={labelStyles}>Verification Code</label>
          <input
            {...register("token")}
            type="text"
            maxLength={6}
            className={inputStyles}
            placeholder="Enter 6-digit code"
          />
          {errors.token && (
            <p className={errorStyles}>{errors.token.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full  bg-primary text-white font-medium py-3 rounded-lg shadow-md hover:shadow-none transition disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default InputOTPForm;
