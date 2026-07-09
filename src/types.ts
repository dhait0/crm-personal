export type OpportunityStatus = "propuesta" | "respondio" | "entrevista" | "ganada" | "perdida";

export type Opportunity = {
  id: string;
  projectDescription: string;
  proposalSent: string;
  proposalSummary: string;
  responded: boolean;
  interview: boolean;
  status: OpportunityStatus;
  won: boolean;
  lossReason: string | null;
  source: string;
  createdAt: string;
};

export type OpportunityInput = {
  projectDescription: string;
  proposalSent: string;
  proposalSummary: string;
  responded: boolean;
  interview: boolean;
  status: OpportunityStatus;
  won: boolean;
  lossReason: string;
  source: string;
};
