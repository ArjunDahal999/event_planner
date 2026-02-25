import { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-dvh items-center gap-y-2 justify-center">
      <h1 className=" text-5xl font-bold text-primary text-center">
        Event Planner
      </h1>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
      {children}
          </Suspense>
    </div>
  );
};

export default AuthLayout;
