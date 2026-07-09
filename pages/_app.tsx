import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initSentry } from "../src/lib/sentry";
import "../src/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initSentry();
  }, []);

  return <Component {...pageProps} />;
}
