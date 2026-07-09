import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { parse, serialize } from "cookie";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

const SESSION_COOKIE = "crm_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  email: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET no esta configurado.");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(token: string) {
  const result = await jwtVerify<SessionPayload>(token, getSecret());
  return result.payload;
}

export function setSessionCookie(response: NextApiResponse, token: string) {
  response.setHeader(
    "Set-Cookie",
    serialize(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS
    })
  );
}

export function clearSessionCookie(response: NextApiResponse) {
  response.setHeader(
    "Set-Cookie",
    serialize(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    })
  );
}

export async function getSessionFromApiRequest(request: NextApiRequest) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  const token = cookies[SESSION_COOKIE];

  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function getSessionFromPageContext(context: GetServerSidePropsContext) {
  const cookieHeader = context.req?.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  const token = cookies[SESSION_COOKIE];

  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
