import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import ProposalEditor from "../ProposalEditor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { id }, select: { title: true } });
  return { title: proposal?.title || "Edit Proposal" };
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const [proposal, clients] = await Promise.all([
    prisma.proposal.findUnique({
      where: { id, userId },
      include: { client: { select: { name: true, company: true, email: true } } },
    }),
    prisma.client.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, company: true, email: true },
    }),
  ]);

  if (!proposal) notFound();

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      <ProposalEditor
        proposalId={proposal.id}
        initialData={proposal}
        clients={clients}
      />
    </div>
  );
}
