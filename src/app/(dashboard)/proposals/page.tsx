import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProposalsClient from "./ProposalsClient";

export const metadata = { title: "Proposals" };

export default async function ProposalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const proposals = await prisma.proposal.findMany({
    where: { userId: (session.user as { id: string }).id },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  });

  return <ProposalsClient proposals={proposals} />;
}
