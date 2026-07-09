import { BellRing, DatabaseZap, Mail, Telescope } from "lucide-react";
import { OpportunityBoard } from "./components/OpportunityBoard";
import { OpportunityForm } from "./components/OpportunityForm";
import { StatCard } from "./components/StatCard";
import { useOpportunities } from "./hooks/useOpportunities";

const automationIdeas = [
  {
    icon: <Mail size={18} />,
    title: "Gmail personal",
    description: "Recomendado solo como entrada controlada. Lo mas estable es usar un label dedicado y reenviar correos relevantes a una automatizacion."
  },
  {
    icon: <DatabaseZap size={18} />,
    title: "Ingreso automatico",
    description: "Supabase Edge Function recibe oportunidades desde formularios, Apps Script, Zapier o n8n con un token secreto."
  },
  {
    icon: <BellRing size={18} />,
    title: "Seguimiento",
    description: "Sentry es recomendable para capturar errores del frontend y del flujo de ingesta sin agregar mucha carga operativa."
  }
];

export default function App() {
  const { items, loading, error, stats, isDemoMode, createOpportunity } = useOpportunities();

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">CRM personal</p>
          <h1>Seguimiento claro de propuestas, entrevistas y proyectos ganados.</h1>
          <p className="hero-text">
            Cada oportunidad conserva descripcion del proyecto, propuesta enviada, respuesta, entrevista,
            cierre y motivo de perdida. El backend queda listo para recibir nuevas oportunidades de forma automatica.
          </p>
        </div>

        <div className="hero-summary">
          <div className="summary-row">
            <Telescope size={18} />
            <span>{isDemoMode ? "Modo demo local activo" : "Conectado a Supabase"}</span>
          </div>
          <div className="summary-row">
            <Mail size={18} />
            <span>Preparado para intake desde Gmail, formularios o automatizaciones</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Total" value={stats.total} hint="Oportunidades registradas" />
        <StatCard label="Respondieron" value={stats.responded} hint="Contacto con feedback" />
        <StatCard label="Entrevistas" value={stats.interviews} hint="Reuniones o discovery calls" />
        <StatCard label="Ganadas" value={stats.won} hint="Proyectos cerrados" />
        <StatCard label="Perdidas" value={stats.lost} hint="Casos con cierre negativo" />
      </section>

      {error ? <p className="error-banner">Error de datos: {error}</p> : null}

      <section className="content-grid">
        <OpportunityForm onSubmit={createOpportunity} />
        <OpportunityBoard items={items} loading={loading} />
      </section>

      <section className="automation-grid">
        {automationIdeas.map((idea) => (
          <article className="automation-item" key={idea.title}>
            <div className="automation-icon">{idea.icon}</div>
            <h2>{idea.title}</h2>
            <p>{idea.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
