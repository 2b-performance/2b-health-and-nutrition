import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { isStage, closedAtForStage } from "@/lib/stages";

const createSchema = z.object({
  title: z.string().trim().min(1, "Informe o título do negócio"),
  valueReais: z.coerce.number().min(0).default(0),
  stage: z.string().refine(isStage, "Etapa inválida").default("NOVO"),
  contactId: z.string().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const user = await requireUser();
    const deals = await prisma.deal.findMany({
      where: { ownerId: user.id },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: { contact: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ deals });
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

    // Valida o contato (se enviado) pertence ao usuário.
    let contactId: string | null = null;
    if (d.contactId) {
      const c = await prisma.contact.findFirst({
        where: { id: d.contactId, ownerId: user.id },
        select: { id: true },
      });
      if (!c) {
        return NextResponse.json({ error: "Contato inválido" }, { status: 400 });
      }
      contactId = c.id;
    }

    // Novo card entra no fim da coluna.
    const last = await prisma.deal.findFirst({
      where: { ownerId: user.id, stage: d.stage },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const deal = await prisma.deal.create({
      data: {
        ownerId: user.id,
        title: d.title,
        valueCents: Math.round(d.valueReais * 100),
        stage: d.stage,
        position: (last?.position ?? -1) + 1,
        closedAt: closedAtForStage(d.stage),
        contactId,
      },
      include: { contact: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ deal }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
