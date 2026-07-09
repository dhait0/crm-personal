import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { getSessionFromApiRequest } from "../../../src/lib/auth";
import { prisma } from "../../../src/lib/prisma";
import { opportunityCreateSchema } from "../../../src/server/schemas/opportunity";

function mapOpportunity(opportunity: {
  id: string;
  projectDescription: string;
  proposalSummary: string;
  proposalSent: Date;
  responded: boolean;
  interview: boolean;
  won: boolean;
  status: string;
  lossReason: string | null;
  source: string;
  createdAt: Date;
}) {
  return {
    id: opportunity.id,
    projectDescription: opportunity.projectDescription,
    proposalSummary: opportunity.proposalSummary,
    proposalSent: opportunity.proposalSent.toISOString().slice(0, 10),
    responded: opportunity.responded,
    interview: opportunity.interview,
    won: opportunity.won,
    status: opportunity.status,
    lossReason: opportunity.lossReason,
    source: opportunity.source,
    createdAt: opportunity.createdAt.toISOString()
  };
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSessionFromApiRequest(request);

  if (!session) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (request.method === "GET") {
    const opportunities = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" }
    });

    response.status(200).json(opportunities.map(mapOpportunity));
    return;
  }

  if (request.method === "POST") {
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

      response.status(201).json(mapOpportunity(created));
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la oportunidad.";
      response.status(400).json({ error: message });
      return;
    }
  }

  response.setHeader("Allow", "GET, POST");
  response.status(405).json({ error: "Method not allowed" });
}
