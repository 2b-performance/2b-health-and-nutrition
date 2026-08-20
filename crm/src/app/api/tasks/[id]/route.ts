import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { parseDueDate } from "@/lib/date";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  done: z.boolean().optional(),
  dueDate: z.string().optional().nullable(),
  contactId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
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
    const existing = await prisma.task.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }
    const d = parsed.data;

    let contactId: string | null | undefined = undefined;
    if (d.contactId !== undefined) {
      if (d.contactId) {
        const c = await prisma.contact.findFirst({
          where: { id: d.contactId, ownerId: user.id },
          select: { id: true },
        });
        if (!c) return NextResponse.json({ error: "Contato inválido" }, { status: 400 });
        contactId = c.id;
      } else contactId = null;
    }

    let dealId: string | null | undefined = undefined;
    if (d.dealId !== undefined) {
      if (d.dealId) {
        const deal = await prisma.deal.findFirst({
          where: { id: d.dealId, ownerId: user.id },
          select: { id: true },
        });
        if (!deal) return NextResponse.json({ error: "Negócio inválido" }, { status: 400 });
        dealId = deal.id;
      } else dealId = null;
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(d.title !== undefined ? { title: d.title } : {}),
        ...(d.done !== undefined ? { done: d.done } : {}),
        ...(d.dueDate !== undefined ? { dueDate: parseDueDate(d.dueDate) } : {}),
        ...(contactId !== undefined ? { contactId } : {}),
        ...(dealId !== undefined ? { dealId } : {}),
      },
      include: {
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ task });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const existing = await prisma.task.findFirst({
      where: { id: params.id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
