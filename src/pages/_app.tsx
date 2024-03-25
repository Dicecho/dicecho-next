import "./globals.css";
import "./components.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Layout } from "@/components/Layout";
import { Header } from "@/components/Header";
import { TailwindToaster } from "@/components/Toaster";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <main className={inter.className}>
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
      </main>
      <TailwindToaster />
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
