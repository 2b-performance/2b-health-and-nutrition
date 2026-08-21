import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";

const updateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do contato").optional(),
  email: z.string().trim().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const contact = await prisma.contact.findFirst({
      where: { id: params.id, ownerId: user.id },
      include: { deals: { orderBy: { updatedAt: "desc" } } },
    });
    if (!contact) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ contact });
  } catch (e) {
    return handleError(e);
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const parsed = updateSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }
    const existing = await prisma.contact.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }
    const d = parsed.data;
    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: {
        ...(d.name !== undefined ? { name: d.name } : {}),
        ...(d.email !== undefined ? { email: d.email || null } : {}),
        ...(d.phone !== undefined ? { phone: d.phone || null } : {}),
        ...(d.company !== undefined ? { company: d.company || null } : {}),
        ...(d.notes !== undefined ? { notes: d.notes || null } : {}),
      },
    });
    return NextResponse.json({ contact });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const existing = await prisma.contact.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }
    await prisma.contact.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
