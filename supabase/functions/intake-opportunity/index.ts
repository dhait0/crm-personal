import { createClient } from "jsr:@supabase/supabase-js@2";

type OpportunityPayload = {
  projectDescription?: string;
  proposalSummary?: string;
  proposalSent?: string;
  responded?: boolean;
  interview?: boolean;
  won?: boolean;
  status?: "propuesta" | "respondio" | "entrevista" | "ganada" | "perdida";
  lossReason?: string | null;
  source?: string;
  metadata?: Record<string, unknown>;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-intake-token"
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const intakeToken = Deno.env.get("INTAKE_TOKEN");
  const providedToken = request.headers.get("x-intake-token");

  if (!intakeToken || providedToken !== intakeToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const payload = (await request.json()) as OpportunityPayload;

  if (!payload.projectDescription || !payload.proposalSummary || !payload.proposalSent) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const status = payload.status ?? "propuesta";

  const { data, error } = await supabase
    .from("opportunities")
    .insert({
      project_description: payload.projectDescription,
      proposal_summary: payload.proposalSummary,
      proposal_sent: payload.proposalSent,
      responded: payload.responded ?? status !== "propuesta",
      interview: payload.interview ?? status === "entrevista" || status === "ganada",
      won: payload.won ?? status === "ganada",
      status,
      loss_reason: payload.lossReason ?? null,
      source: payload.source ?? "automation",
      metadata: payload.metadata ?? {}
    })
    .select("id, status, created_at")
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true, record: data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
