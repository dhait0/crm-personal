import { BriefcaseBusiness, CircleCheckBig, CircleDashed, Handshake, MessageSquareReply, XCircle } from "lucide-react";
import type { Opportunity } from "../types";

type OpportunityBoardProps = {
  items: Opportunity[];
  loading: boolean;
};

function statusLabel(item: Opportunity) {
  switch (item.status) {
    case "ganada":
      return "Ganada";
    case "perdida":
      return "Perdida";
    case "entrevista":
      return "Entrevista";
    case "respondio":
      return "Respondio";
    default:
      return "Propuesta";
  }
}

function statusIcon(item: Opportunity) {
  switch (item.status) {
    case "ganada":
      return <CircleCheckBig size={18} />;
    case "perdida":
      return <XCircle size={18} />;
    case "entrevista":
      return <Handshake size={18} />;
    case "respondio":
      return <MessageSquareReply size={18} />;
    default:
      return <CircleDashed size={18} />;
  }
}

export function OpportunityBoard({ items, loading }: OpportunityBoardProps) {
  return (
    <section className="glass-panel board-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>Oportunidades registradas</h2>
        </div>
      </div>

      {loading ? <p className="empty-state">Cargando oportunidades...</p> : null}

      {!loading && items.length === 0 ? (
        <p className="empty-state">No hay oportunidades registradas todavia.</p>
      ) : null}

      <div className="opportunity-list">
        {items.map((item) => (
          <article className="opportunity-item" key={item.id}>
            <div className="opportunity-top">
              <div className="status-chip">
                {statusIcon(item)}
                <span>{statusLabel(item)}</span>
              </div>
              <span className="source-chip">{item.source}</span>
            </div>

            <div className="opportunity-body">
              <div className="opportunity-title">
                <BriefcaseBusiness size={18} />
                <h3>{item.projectDescription}</h3>
              </div>
              <p>{item.proposalSummary}</p>
            </div>

            <dl className="opportunity-meta">
              <div>
                <dt>Enviada</dt>
                <dd>{item.proposalSent}</dd>
              </div>
              <div>
                <dt>Respondio</dt>
                <dd>{item.responded ? "Si" : "No"}</dd>
              </div>
              <div>
                <dt>Entrevista</dt>
                <dd>{item.interview ? "Si" : "No"}</dd>
              </div>
              <div>
                <dt>Ganada</dt>
                <dd>{item.won ? "Si" : "No"}</dd>
              </div>
            </dl>

            {item.lossReason ? <p className="loss-reason">Motivo de perdida: {item.lossReason}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
