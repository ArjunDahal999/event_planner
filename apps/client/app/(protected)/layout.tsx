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
  return (
    <div className="flex flex-col pt-4 max-w-7xl mx-auto min-h-screen">
      {children}
    </div>
  );
}
