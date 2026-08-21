import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";

const createSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do contato"),
  email: z.string().trim().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const q = new URL(req.url).searchParams.get("q")?.trim();
    const contacts = await prisma.contact.findMany({
      where: {
        ownerId: user.id,
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      include: { _count: { select: { deals: true } } },
    });
    return NextResponse.json({ contacts });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const parsed = createSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const contact = await prisma.contact.create({
      data: {
        ownerId: user.id,
        name: d.name,
        email: d.email || null,
        phone: d.phone || null,
        company: d.company || null,
        notes: d.notes || null,
      },
    });
    return NextResponse.json({ contact }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
