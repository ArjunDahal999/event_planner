import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  LoginUserDTO,
  loginUserSchema,
} from "@event-planner/shared/src/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";

export function InputOTPForm({
  onSubmit,
  email,
}: {
  onSubmit: (payload: LoginUserDTO) => Promise<void>;
  email: string;
}) {
  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: email,
      token: "",
    },
    mode: "onSubmit",
  });

  const { isSubmitting } = form.formState;

  return (
    <Card className="mx-auto min-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>Check terminal for verification code</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  Verification code
                </FieldLabel>
              </div>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <input {...field} type="email" id="email" hidden />
                )}
              />
              <Controller
                control={form.control}
                name="token"
                render={({ field }) => (
                  <InputOTP
                    value={field.value ?? ""}
                    onChange={(value) => field.onChange(value)}
                    maxLength={6}
                    id="otp-verification"
                    required
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </Field>

            <Field className=" py-4">
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Verify
              </Button>
            </Field>
          </FieldGroup>
        </form>
        {form.formState.errors.token && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.token.message}
          </p>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
