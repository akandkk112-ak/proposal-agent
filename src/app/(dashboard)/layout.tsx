import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NavRail from "@/components/layout/NavRail";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="hidden md:block">
        <NavRail user={session.user} />
      </div>
      <div className="flex-1 flex flex-col md:ml-[196px] ml-0 min-w-0 overflow-hidden w-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
