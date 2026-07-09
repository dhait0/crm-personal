import type { GetServerSideProps } from "next";
import { getSessionFromPageContext } from "../src/lib/auth";

export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSessionFromPageContext(context);

  return {
    redirect: {
      destination: session ? "/dashboard" : "/login",
      permanent: false
    }
  };
};
