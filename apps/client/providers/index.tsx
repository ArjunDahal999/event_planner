import React from "react";
import AuthProvider from "./auth-provider";
import ReactQueryProvider from "./react-query-provider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </React.Fragment>
  );
};

export default Provider;
