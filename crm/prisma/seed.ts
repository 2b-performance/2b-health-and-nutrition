import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Usuário e dados de demonstração. Rode com: npm run db:seed
async function main() {
  const email = "demo@crm.local";
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Usuário Demo", email, passwordHash },
  });

  // Evita duplicar se rodar de novo.
  const existing = await prisma.contact.count({ where: { ownerId: user.id } });
  if (existing > 0) {
    console.log("Seed já aplicado. Nada a fazer.");
    return;
  }

  const ana = await prisma.contact.create({
    data: {
      ownerId: user.id,
      name: "Ana Menezes",
      email: "ana@exemplo.com",
      phone: "(31) 99999-1000",
      company: "Residencial Acácias",
    },
  });
  const bruno = await prisma.contact.create({
    data: {
      ownerId: user.id,
      name: "Bruno Costa",
      phone: "(31) 98888-2000",
      company: "Costa Imóveis",
    },
  });
  await prisma.contact.create({
    data: { ownerId: user.id, name: "Carla Dias", email: "carla@exemplo.com" },
  });

  const dealProposta = await prisma.deal.create({
    data: { ownerId: user.id, title: "Reforma apto 1102", valueCents: 4500000, stage: "PROPOSTA", position: 0, contactId: ana.id },
  });
  // Ganho no mês corrente (dia 10, para cair no mês atual).
  const now = new Date();
  const wonThisMonth = new Date(now.getFullYear(), now.getMonth(), 10, 12);
  // Datas de fechamento em meses anteriores, para a série temporal.
  const monthAgo = (n: number) => new Date(now.getFullYear(), now.getMonth() - n, 15, 12);

  await prisma.deal.createMany({
    data: [
      { ownerId: user.id, title: "Cozinha planejada", valueCents: 1800000, stage: "CONTATO", position: 0, contactId: bruno.id },
      { ownerId: user.id, title: "Pintura fachada", valueCents: 950000, stage: "NOVO", position: 0 },
      { ownerId: user.id, title: "Banheiro suíte", valueCents: 1200000, stage: "GANHO", position: 0, contactId: ana.id, closedAt: wonThisMonth },
      // Histórico de ganhos (meses anteriores)
      { ownerId: user.id, title: "Reforma cozinha - Bruno", valueCents: 2200000, stage: "GANHO", position: 1, contactId: bruno.id, closedAt: monthAgo(1) },
      { ownerId: user.id, title: "Área gourmet", valueCents: 3100000, stage: "GANHO", position: 2, closedAt: monthAgo(2) },
      { ownerId: user.id, title: "Troca de piso - sala", valueCents: 1500000, stage: "GANHO", position: 3, contactId: ana.id, closedAt: monthAgo(3) },
      { ownerId: user.id, title: "Pintura completa", valueCents: 800000, stage: "GANHO", position: 4, closedAt: monthAgo(4) },
      // Um perdido (para a taxa de conversão não ser 100%)
      { ownerId: user.id, title: "Reforma banheiro - orçamento alto", valueCents: 900000, stage: "PERDIDO", position: 0, contactId: bruno.id, closedAt: monthAgo(1) },
    ],
  });

  const day = 24 * 60 * 60 * 1000;
  const nowMs = now.getTime();
  await prisma.task.createMany({
    data: [
      { ownerId: user.id, title: "Enviar proposta revisada", dueDate: new Date(nowMs - day), contactId: ana.id, dealId: dealProposta.id },
      { ownerId: user.id, title: "Ligar para confirmar medidas", dueDate: new Date(nowMs), contactId: bruno.id },
      { ownerId: user.id, title: "Agendar visita técnica", dueDate: new Date(nowMs + 2 * day), contactId: ana.id },
      { ownerId: user.id, title: "Cotar porcelanato", contactId: bruno.id },
      { ownerId: user.id, title: "Fechar cor do rejunte", done: true, contactId: ana.id },
    ],
  });

  console.log("Seed OK. Login: demo@crm.local / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
