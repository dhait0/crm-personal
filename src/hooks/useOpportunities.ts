import { useCallback, useEffect, useMemo, useState } from "react";
import { sampleOpportunities } from "../data/sampleOpportunities";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Opportunity, OpportunityInput } from "../types";

const STORAGE_KEY = "crm-personal-opportunities";

function mapRow(row: Record<string, unknown>): Opportunity {
  return {
    id: String(row.id),
    projectDescription: String(row.project_description ?? ""),
    proposalSent: String(row.proposal_sent ?? ""),
    proposalSummary: String(row.proposal_summary ?? ""),
    responded: Boolean(row.responded),
    interview: Boolean(row.interview),
    status: String(row.status ?? "propuesta") as Opportunity["status"],
    won: Boolean(row.won),
    lossReason: row.loss_reason ? String(row.loss_reason) : null,
    source: String(row.source ?? "manual"),
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

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

    if (!isSupabaseConfigured || !supabase) {
      setItems(loadLocal());
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setItems([]);
      setLoading(false);
      return;
    }

    setItems((data ?? []).map((row) => mapRow(row)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createOpportunity = useCallback(async (input: OpportunityInput) => {
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
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

    const { error: insertError } = await supabase.from("opportunities").insert({
      project_description: input.projectDescription,
      proposal_sent: input.proposalSent,
      proposal_summary: input.proposalSummary,
      responded: input.responded,
      interview: input.interview,
      status: input.status,
      won: input.won,
      loss_reason: input.lossReason || null,
      source: input.source
    });

    if (insertError) {
      setError(insertError.message);
      throw insertError;
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
    isDemoMode: !isSupabaseConfigured,
    refresh,
    createOpportunity
  };
}
