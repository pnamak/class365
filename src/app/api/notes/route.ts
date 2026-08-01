import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth";
import { prisma } from "@/lib/prisma";

/** Sea Notes–compatible notes API (starter kit parity). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: notes });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { title?: string; content?: string };
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 },
    );
  }

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json({ data: note }, { status: 201 });
}
