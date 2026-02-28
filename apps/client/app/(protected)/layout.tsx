import Navbar from "@/components/nav-bar";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col pt-4 max-w-7xl mx-auto min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
