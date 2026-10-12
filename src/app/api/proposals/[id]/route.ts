import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  const proposal = await prisma.proposal.findUnique({
    where: { id, userId },
    include: { client: true },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Increment view count
  await prisma.proposal.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json(proposal);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  try {
    const proposal = await prisma.proposal.update({
      where: { id, userId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.totalAmount !== undefined && { totalAmount: body.totalAmount }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.clientId !== undefined && { clientId: body.clientId }),
        version: { increment: 1 },
      },
    });
    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Update proposal error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  try {
    await prisma.proposal.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
