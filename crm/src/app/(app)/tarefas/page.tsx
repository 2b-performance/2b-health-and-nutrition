import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import TasksView from "@/components/TasksView";

export const dynamic = "force-dynamic";

export default async function TarefasPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [tasks, contacts, deals] = await Promise.all([
    prisma.task.findMany({
      where: { ownerId: user.id },
      orderBy: [{ done: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      },
    }),
    prisma.contact.findMany({
      where: { ownerId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.deal.findMany({
      where: { ownerId: user.id },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  // Serializa Date -> string ISO para o client component.
  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
  }));

  return (
    <TasksView
      initialTasks={serialized}
      contacts={contacts}
      deals={deals.map((d) => ({ id: d.id, name: d.title }))}
    />
  );
}
