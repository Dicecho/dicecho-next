import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
    <html>
      <body className={inter.className}>
        <ThemeProvider
          // defaultTheme="system"
          // enableSystem
          // disableTransitionOnChange
        >
          <Layout>
            <Header />
            {children}
          </Layout>
          <TailwindToaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
