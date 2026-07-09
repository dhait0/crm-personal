import type { Opportunity, OpportunityInput } from "../types";

export async function fetchOpportunities() {
  const response = await fetch("/api/opportunities", {
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las oportunidades.");
  }

  return (await response.json()) as Opportunity[];
}

export async function createOpportunity(input: OpportunityInput) {
  const response = await fetch("/api/opportunities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "No se pudo guardar la oportunidad.");
  }

  return (await response.json()) as Opportunity;
}
