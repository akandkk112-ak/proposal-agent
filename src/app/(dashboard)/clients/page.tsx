import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientsClient from "./ClientsClient";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const clients = await prisma.client.findMany({
    where: { userId },
    include: {
      proposals: {
        select: { id: true, status: true, totalAmount: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <ClientsClient clients={clients} />;
}
