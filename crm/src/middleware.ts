import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Rotas públicas (não exigem login).
const PUBLIC_PATHS = ["/login", "/register"];
const PUBLIC_API = ["/api/auth/login", "/api/auth/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  const isApi = pathname.startsWith("/api");
  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isPublicApi = PUBLIC_API.some((p) => pathname.startsWith(p));

  // APIs protegidas: sem sessão -> 401 JSON.
  if (isApi && !isPublicApi && !session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Páginas protegidas: sem sessão -> manda para o login.
  if (!isApi && !isPublicPage && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Já logado tentando abrir login/cadastro -> vai para o pipeline.
  if (!isApi && isPublicPage && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/pipeline";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a tudo, menos assets estáticos do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
