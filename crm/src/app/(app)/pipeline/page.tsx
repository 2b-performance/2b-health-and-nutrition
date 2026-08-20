import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Board from "@/components/Board";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [deals, contacts] = await Promise.all([
    prisma.deal.findMany({
      where: { ownerId: user.id },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: { contact: { select: { id: true, name: true } } },
    }),
    prisma.contact.findMany({
      where: { ownerId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return <Board initialDeals={deals} contacts={contacts} />;
}
