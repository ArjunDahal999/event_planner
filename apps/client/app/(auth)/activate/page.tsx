"use client";
import { authService } from "@/services/auth.service";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
const ActivatePage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifyEmailOnLoad = async () => {
      setIsSubmitting(true);
      try {
        if (!email || !token) {
          toast.error("Invalid activation link. Missing email or token.");
          return;
        }
        const { message } = await authService().verifyEmail({ email, token });
        toast.success(message);
        router.push("/login?email=" + encodeURIComponent(email));
      } catch (error) {
        console.error("Email verification error:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    verifyEmailOnLoad();
  }, [email, token, router]);
  return (
    <div className="p-4">
      <h1 className="text-2xl flex items-center text-center font-bold mb-4">
        {isSubmitting && <Loader2Icon className="animate-spin mr-2" />}
        Activating your account...
      </h1>
    </div>
  );
};

export default ActivatePage;
