import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../src/lib/prisma";
import { setSessionCookie, signSession, verifyPassword } from "../../../src/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase()
      }
    });

    if (!user) {
      response.status(401).json({ error: "Credenciales invalidas." });
      return;
    }

    const validPassword = await verifyPassword(payload.password, user.passwordHash);

    if (!validPassword) {
      response.status(401).json({ error: "Credenciales invalidas." });
      return;
    }

    const token = await signSession({
      userId: user.id,
      email: user.email
    });

    setSessionCookie(response, token);
    response.status(200).json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesion.";
    response.status(400).json({ error: message });
  }
}
