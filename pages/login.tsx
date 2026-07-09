import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import type { GetServerSideProps } from "next";
import { LockKeyhole, Mail } from "lucide-react";
import { getSessionFromPageContext } from "../src/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "No se pudo iniciar sesion.");
      }

      await router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login | CRM Personal</title>
      </Head>
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="auth-copy">
            <p className="eyebrow">Acceso privado</p>
            <h1>Entra a tu CRM personal</h1>
            <p>
              Esta primera version usa email y password sobre Prisma. El objetivo inmediato es proteger el pipeline y
              preparar el acceso a oportunidades reales.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="input-with-icon">
                <LockKeyhole size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tu password"
                  required
                />
              </div>
            </label>

            {error ? <p className="error-banner">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesion"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSessionFromPageContext(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    };
  }

  return { props: {} };
};
