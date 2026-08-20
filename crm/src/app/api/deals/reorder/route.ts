import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { isStage } from "@/lib/stages";

// Recebe a etapa de destino e a ordem final dos cards nela.
// Move o card (se mudou de coluna) e renumera as posições.
const schema = z.object({
  stage: z.string().refine(isStage, "Etapa inválida"),
  orderedIds: z.array(z.string()).max(1000),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 },
      );
    }
    const { stage, orderedIds } = parsed.data;

    // Garante que todos os cards pertencem ao usuário.
    const owned = await prisma.deal.findMany({
      where: { id: { in: orderedIds }, ownerId: user.id },
      select: { id: true },
    });
    const ownedSet = new Set(owned.map((d) => d.id));
    const validIds = orderedIds.filter((id) => ownedSet.has(id));

    await prisma.$transaction(
      validIds.map((id, index) =>
        prisma.deal.update({
          where: { id },
          data: { stage, position: index },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
