import { useMemo, useState } from "react";
import type { OpportunityInput, OpportunityStatus } from "../types";

const initialState: OpportunityInput = {
  projectDescription: "",
  proposalSent: new Date().toISOString().slice(0, 10),
  proposalSummary: "",
  responded: false,
  interview: false,
  status: "propuesta",
  won: false,
  lossReason: "",
  source: "manual"
};

const statusOptions: Array<{ value: OpportunityStatus; label: string }> = [
  { value: "propuesta", label: "Propuesta enviada" },
  { value: "respondio", label: "Respondió" },
  { value: "entrevista", label: "Hubo entrevista" },
  { value: "ganada", label: "Proyecto ganado" },
  { value: "perdida", label: "Proyecto perdido" }
];

type OpportunityFormProps = {
  onSubmit: (input: OpportunityInput) => Promise<void>;
};

export function OpportunityForm({ onSubmit }: OpportunityFormProps) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const showLossReason = useMemo(() => form.status === "perdida", [form.status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const normalized: OpportunityInput = {
      ...form,
      responded: form.responded || form.status !== "propuesta",
      interview: form.interview || form.status === "entrevista" || form.status === "ganada",
      won: form.status === "ganada",
      lossReason: form.status === "perdida" ? form.lossReason : ""
    };

    try {
      await onSubmit(normalized);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Registro</p>
          <h2>Nueva oportunidad</h2>
        </div>
      </div>

      <form className="crm-form" onSubmit={handleSubmit}>
        <label>
          <span>Descripción del proyecto</span>
          <textarea
            rows={4}
            value={form.projectDescription}
            onChange={(event) => setForm({ ...form, projectDescription: event.target.value })}
            placeholder="Ej. Automatización comercial para firma de servicios."
            required
          />
        </label>

        <label>
          <span>Propuesta enviada</span>
          <textarea
            rows={3}
            value={form.proposalSummary}
            onChange={(event) => setForm({ ...form, proposalSummary: event.target.value })}
            placeholder="Resumen de alcance, precio, tiempos y siguientes pasos."
            required
          />
        </label>

        <div className="form-grid">
          <label>
            <span>Fecha de envío</span>
            <input
              type="date"
              value={form.proposalSent}
              onChange={(event) => setForm({ ...form, proposalSent: event.target.value })}
              required
            />
          </label>

          <label>
            <span>Fuente</span>
            <input
              type="text"
              value={form.source}
              onChange={(event) => setForm({ ...form, source: event.target.value })}
              placeholder="manual, gmail, referido, linkedin"
              required
            />
          </label>
        </div>

        <label>
          <span>Estado</span>
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as OpportunityStatus })}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="check-grid">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.responded}
              onChange={(event) => setForm({ ...form, responded: event.target.checked })}
            />
            <span>Respondió</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.interview}
              onChange={(event) => setForm({ ...form, interview: event.target.checked })}
            />
            <span>Hubo entrevista</span>
          </label>
        </div>

        {showLossReason ? (
          <label>
            <span>Motivo de pérdida</span>
            <textarea
              rows={3}
              value={form.lossReason}
              onChange={(event) => setForm({ ...form, lossReason: event.target.value })}
              placeholder="Precio, timing, fit técnico, prioridad del cliente, etc."
            />
          </label>
        ) : null}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar oportunidad"}
        </button>
      </form>
    </section>
  );
}
