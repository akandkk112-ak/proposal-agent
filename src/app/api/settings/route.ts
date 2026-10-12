import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  try {
    // Upsert settings
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        companyName: body.companyName,
        companyAddress: body.address,
        taxId: body.taxId,
        currency: body.currency?.split(" ")[0] || "USD",
        accentColor: body.accentColor || "#7C3AED",
        pageFormat: body.pageFormat || "A4",
        fontFamily: body.fontFamily,
      },
      create: {
        userId,
        companyName: body.companyName,
        companyAddress: body.address,
        taxId: body.taxId,
        currency: body.currency?.split(" ")[0] || "USD",
        accentColor: body.accentColor || "#7C3AED",
        pageFormat: body.pageFormat || "A4",
        fontFamily: body.fontFamily,
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  return NextResponse.json(settings || {});
}
