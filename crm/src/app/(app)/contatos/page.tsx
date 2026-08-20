import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import ContactsView from "@/components/ContactsView";

export const dynamic = "force-dynamic";

export default async function ContatosPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const contacts = await prisma.contact.findMany({
    where: { ownerId: user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { deals: true } } },
  });

  return <ContactsView initialContacts={contacts} />;
}
