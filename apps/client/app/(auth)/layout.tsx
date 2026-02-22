import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-dvh items-center gap-y-2 justify-center">
      <h1 className=" text-5xl font-bold text-primary ">Event Planner</h1>
      {children}
    </div>
  );
};

export default AuthLayout;
