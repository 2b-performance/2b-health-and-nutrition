import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";

// Tradução de exceções para respostas HTTP nas rotas de API.
export function handleError(e: unknown) {
  if (e instanceof AuthError) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  console.error(e);
  return NextResponse.json({ error: "Erro interno" }, { status: 500 });
}
