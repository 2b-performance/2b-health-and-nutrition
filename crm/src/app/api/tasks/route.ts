import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { parseDueDate } from "@/lib/date";

const createSchema = z.object({
  title: z.string().trim().min(1, "Informe a tarefa"),
  dueDate: z.string().optional().nullable(),
  contactId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const tasks = await prisma.task.findMany({
      where: { ownerId: user.id },
      orderBy: [{ done: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ tasks });
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

    // Valida vínculos (se enviados) pertencem ao usuário.
    const contactId = await validateOwned("contact", d.contactId, user.id);
    if (contactId === false)
      return NextResponse.json({ error: "Contato inválido" }, { status: 400 });
    const dealId = await validateOwned("deal", d.dealId, user.id);
    if (dealId === false)
      return NextResponse.json({ error: "Negócio inválido" }, { status: 400 });

    const task = await prisma.task.create({
      data: {
        ownerId: user.id,
        title: d.title,
        dueDate: parseDueDate(d.dueDate),
        contactId: contactId || null,
        dealId: dealId || null,
      },
      include: {
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}

// Retorna o id validado, "" quando não enviado, ou false quando inválido.
async function validateOwned(
  kind: "contact" | "deal",
  id: string | null | undefined,
  ownerId: string,
): Promise<string | false> {
  if (!id) return "";
  const found =
    kind === "contact"
      ? await prisma.contact.findFirst({ where: { id, ownerId }, select: { id: true } })
      : await prisma.deal.findFirst({ where: { id, ownerId }, select: { id: true } });
  return found ? found.id : false;
}
