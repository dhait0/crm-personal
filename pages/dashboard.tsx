import Head from "next/head";
import { LogOut } from "lucide-react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AppShell } from "../src/App";
import { getSessionFromPageContext } from "../src/lib/auth";

export default function DashboardPage({
  email
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <>
      <Head>
        <title>Dashboard | CRM Personal</title>
      </Head>
      <div className="session-bar">
        <span>{email}</span>
        <button className="ghost-button" type="button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
      <AppShell />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ email: string }> = async (context) => {
  const session = await getSessionFromPageContext(context);

  if (!session?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  return {
    props: {
      email: session.email
    }
  };
};
