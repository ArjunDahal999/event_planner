"use client";

import { AuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const LandingPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext && !authContext.isLoading && !authContext.isAuthenticated) {
      router.push("/login");
    }
  }, [authContext, router]);

  if (authContext?.isLoading) {
    return <div className="text-5xl">Loading...</div>;
  }

  return (
    <div className="text-5xl">
      {authContext?.isAuthenticated
        ? "Welcome back!"
        : "Welcome to Event Planner!"}
    </div>
  );
};

export default LandingPage;
