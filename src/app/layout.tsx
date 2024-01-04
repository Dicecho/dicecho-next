import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Layout } from "@/components/Layout";
import { Header } from "@/components/Header";
import { TailwindToaster } from "@/components/Toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "骰声回响 | Dicecho",
  description: "TRPG一站式社区",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="dim">
      <body className={inter.className}>
        <Layout>
          <Header />
          {children}
        </Layout>
        <TailwindToaster position="top-center" />
      </body>
    </html>
  );
}
