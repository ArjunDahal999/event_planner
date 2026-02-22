// app/protected-layout.tsx (server component)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesList = await cookies();
  if (!cookiesList.get("refresh_token")?.value) {
    redirect("/login");
  }
  return <>{children}</>;
}
