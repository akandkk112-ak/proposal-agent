import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateReference } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const proposals = await prisma.proposal.findMany({
    where: { userId, ...(status ? { status } : {}) },
    include: { client: { select: { name: true, company: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(proposals);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const body = await request.json();
    const { title, clientId, content, totalAmount, currency, status } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // If no clientId, create a placeholder client
    let resolvedClientId = clientId;
    if (!resolvedClientId) {
      const placeholderClient = await prisma.client.create({
        data: {
          name: "New Client",
          email: `client-${Date.now()}@placeholder.com`,
          userId,
        },
      });
      resolvedClientId = placeholderClient.id;
    }

    const proposal = await prisma.proposal.create({
      data: {
        title,
        reference: generateReference(),
        status: status || "DRAFT",
        content: content || "{}",
        totalAmount: totalAmount || 0,
        currency: currency || "USD",
        clientId: resolvedClientId,
        userId,
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}
