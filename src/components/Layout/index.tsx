"use client";
import { SWRConfig } from "swr";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <SWRConfig>{children}</SWRConfig>;
};
