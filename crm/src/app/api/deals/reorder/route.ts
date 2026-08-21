import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { isStage, closedAtForStage } from "@/lib/stages";

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

    // Garante que todos os cards pertencem ao usuário (traz stage/closedAt atuais).
    const owned = await prisma.deal.findMany({
      where: { id: { in: orderedIds }, ownerId: user.id },
      select: { id: true, stage: true, closedAt: true },
    });
    const ownedMap = new Map(owned.map((d) => [d.id, d]));
    const validIds = orderedIds.filter((id) => ownedMap.has(id));

    await prisma.$transaction(
      validIds.map((id, index) => {
        const current = ownedMap.get(id)!;
        // Só recalcula closedAt se a etapa mudou nesta operação.
        const closedAt =
          stage !== current.stage
            ? closedAtForStage(stage, current.closedAt)
            : undefined;
        return prisma.deal.update({
          where: { id },
          data: {
            stage,
            position: index,
            ...(closedAt !== undefined ? { closedAt } : {}),
          },
        });
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
