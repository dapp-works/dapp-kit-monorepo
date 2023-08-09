import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import  authOptions from "../pages/api/auth/[...nextauth]";

import "~/styles/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default async  function Layout(props: { children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        {props.children}
        {/* <TRPCReactProvider headers={headers()}>{props.children}</TRPCReactProvider> */}
      </body>
    </html>
  );
}
