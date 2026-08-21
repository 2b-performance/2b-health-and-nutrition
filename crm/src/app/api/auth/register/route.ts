import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { handleError } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Informe seu nome"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }
  const { name, email, password } = parsed.data;
  const emailLower = email.toLowerCase();

  try {
    // Deixa a constraint @unique decidir: evita a corrida do check-then-create.
    const user = await prisma.user.create({
      data: { name, email: emailLower, passwordHash: await hashPassword(password) },
      select: { id: true, email: true },
    });
    await setSessionCookie(user.id, user.email);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail" },
        { status: 409 },
      );
    }
    return handleError(e);
  }
}
