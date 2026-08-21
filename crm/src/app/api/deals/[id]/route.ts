import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { isStage, closedAtForStage } from "@/lib/stages";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  valueReais: z.coerce.number().min(0).optional(),
  stage: z.string().refine(isStage, "Etapa inválida").optional(),
  contactId: z.string().optional().or(z.literal("")).or(z.null()),
});

type Params = { params: { id: string } };

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
    const existing = await prisma.deal.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true, stage: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 });
    }
    const d = parsed.data;

    // Recalcula closedAt quando a etapa muda (fechou/reabriu o negócio).
    const closedAt =
      d.stage !== undefined && d.stage !== existing.stage
        ? closedAtForStage(d.stage)
        : undefined;

    let contactId: string | null | undefined = undefined;
    if (d.contactId !== undefined) {
      if (d.contactId) {
        const c = await prisma.contact.findFirst({
          where: { id: d.contactId, ownerId: user.id },
          select: { id: true },
        });
        if (!c) {
          return NextResponse.json({ error: "Contato inválido" }, { status: 400 });
        }
        contactId = c.id;
      } else {
        contactId = null;
      }
    }

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...(d.title !== undefined ? { title: d.title } : {}),
        ...(d.valueReais !== undefined
          ? { valueCents: Math.round(d.valueReais * 100) }
          : {}),
        ...(d.stage !== undefined ? { stage: d.stage } : {}),
        ...(closedAt !== undefined ? { closedAt } : {}),
        ...(contactId !== undefined ? { contactId } : {}),
      },
      include: { contact: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ deal });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const existing = await prisma.deal.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 });
    }
    await prisma.deal.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
