import { z } from "zod";

export const opportunityStatusSchema = z.enum([
  "propuesta",
  "respondio",
  "entrevista",
  "ganada",
  "perdida"
]);

export const opportunityCreateSchema = z.object({
  projectDescription: z.string().min(5),
  proposalSummary: z.string().min(5),
  proposalSent: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  responded: z.boolean().optional(),
  interview: z.boolean().optional(),
  won: z.boolean().optional(),
  status: opportunityStatusSchema.default("propuesta"),
  lossReason: z.string().trim().nullish(),
  source: z.string().trim().min(1).default("manual"),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type OpportunityCreateInput = z.infer<typeof opportunityCreateSchema>;
