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

  await prisma.deal.createMany({
    data: [
      { ownerId: user.id, title: "Reforma apto 1102", valueCents: 4500000, stage: "PROPOSTA", position: 0, contactId: ana.id },
      { ownerId: user.id, title: "Cozinha planejada", valueCents: 1800000, stage: "CONTATO", position: 0, contactId: bruno.id },
      { ownerId: user.id, title: "Pintura fachada", valueCents: 950000, stage: "NOVO", position: 0 },
      { ownerId: user.id, title: "Banheiro suíte", valueCents: 1200000, stage: "GANHO", position: 0, contactId: ana.id },
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
