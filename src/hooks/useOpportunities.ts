import { useCallback, useEffect, useMemo, useState } from "react";
import { sampleOpportunities } from "../data/sampleOpportunities";
import { createOpportunity as createOpportunityRequest, fetchOpportunities } from "../lib/api";
import type { Opportunity, OpportunityInput } from "../types";

const STORAGE_KEY = "crm-personal-opportunities";

function loadLocal(): Opportunity[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOpportunities));
    return sampleOpportunities;
  }

  try {
    return JSON.parse(raw) as Opportunity[];
  } catch {
    return sampleOpportunities;
  }
}

export function useOpportunities() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchOpportunities();
      setItems(data);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Error al cargar datos.";
      setError(message);
      setItems(loadLocal());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createOpportunity = useCallback(async (input: OpportunityInput) => {
    setError(null);

    try {
      await createOpportunityRequest(input);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Error al guardar datos.";
      setError(message);
      const nextItem: Opportunity = {
        id: crypto.randomUUID(),
        projectDescription: input.projectDescription,
        proposalSent: input.proposalSent,
        proposalSummary: input.proposalSummary,
        responded: input.responded,
        interview: input.interview,
        status: input.status,
        won: input.won,
        lossReason: input.lossReason || null,
        source: input.source,
        createdAt: new Date().toISOString()
      };

      const nextItems = [nextItem, ...loadLocal()];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      setItems(nextItems);
      return;
    }

    await refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const total = items.length;
    const responded = items.filter((item) => item.responded).length;
    const interviews = items.filter((item) => item.interview).length;
    const won = items.filter((item) => item.won).length;
    const lost = items.filter((item) => item.status === "perdida").length;

    return { total, responded, interviews, won, lost };
  }, [items]);

  return {
    items,
    loading,
    error,
    stats,
    isDemoMode: Boolean(error),
    refresh,
    createOpportunity
  };
}
