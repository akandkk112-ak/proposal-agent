import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProposalEditor from "../ProposalEditor";

export const metadata = { title: "New Proposal" };

export default async function NewProposalPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const { template: templateId } = await searchParams;

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, company: true, email: true },
  });

  let initialData = undefined;
  if (templateId) {
    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (template) {
      initialData = {
        title: `${template.name} (Copy)`,
        content: template.structure,
        status: "DRAFT",
        version: 1,
        totalAmount: 0,
        currency: "USD",
        clientId: ""
      };
    }
  }

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      <ProposalEditor clients={clients} initialData={initialData as any} />
    </div>
  );
}
