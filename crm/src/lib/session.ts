import { SignJWT, jwtVerify } from "jose";

// Utilitários de sessão baseados em JWT (HS256). Apenas `jose`, sem
// dependências de Node — seguro para rodar no Edge (middleware).

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) {
  // Falha cedo e clara: sem segredo não há sessão segura.
  throw new Error("AUTH_SECRET não definido no ambiente (.env).");
}
const key = new TextEncoder().encode(SECRET);

export type SessionPayload = { userId: string; email: string };

const COOKIE = "crm_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key);
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (typeof payload.userId === "string" && typeof payload.email === "string") {
      return { userId: payload.userId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}
