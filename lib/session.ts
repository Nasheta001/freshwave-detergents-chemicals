import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "fw_admin";
const MAX_AGE = 60 * 60 * 8;

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 24) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set to a long random string in production.");
    }
    return new TextEncoder().encode("freshwave-development-only-secret-not-for-production");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(adminId: number, email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<{ id: number; email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return { id: Number(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE;
