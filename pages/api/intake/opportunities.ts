import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../src/lib/prisma";
import { opportunityCreateSchema } from "../../../src/server/schemas/opportunity";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const providedToken = request.headers["x-intake-token"];

  if (!process.env.INTAKE_TOKEN || providedToken !== process.env.INTAKE_TOKEN) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = opportunityCreateSchema.parse(request.body);
    const status = payload.status;

    const created = await prisma.opportunity.create({
      data: {
        projectDescription: payload.projectDescription,
        proposalSummary: payload.proposalSummary,
        proposalSent: new Date(`${payload.proposalSent}T00:00:00.000Z`),
        responded: payload.responded ?? status !== "propuesta",
        interview: payload.interview ?? (status === "entrevista" || status === "ganada"),
        won: payload.won ?? status === "ganada",
        status,
        lossReason: payload.lossReason ?? null,
        source: payload.source,
        metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue
      }
    });

    response.status(201).json({
      ok: true,
      record: {
        id: created.id,
        status: created.status,
        createdAt: created.createdAt.toISOString()
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo registrar la oportunidad.";
    response.status(400).json({ error: message });
  }
}
