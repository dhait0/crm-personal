import type { Opportunity } from "../types";

export const sampleOpportunities: Opportunity[] = [
  {
    id: "seed-1",
    projectDescription: "Rediseño de pipeline comercial para consultora boutique.",
    proposalSent: "2026-07-02",
    proposalSummary: "Automatización de seguimiento de leads, tableros y reporting ejecutivo.",
    responded: true,
    interview: true,
    status: "entrevista",
    won: false,
    lossReason: null,
    source: "referido",
    createdAt: "2026-07-02T14:00:00.000Z"
  },
  {
    id: "seed-2",
    projectDescription: "Implementación de CRM operativo para estudio legal.",
    proposalSent: "2026-06-28",
    proposalSummary: "Setup de procesos comerciales, automatización de intake y KPIs.",
    responded: false,
    interview: false,
    status: "propuesta",
    won: false,
    lossReason: null,
    source: "linkedin",
    createdAt: "2026-06-28T10:30:00.000Z"
  }
];
