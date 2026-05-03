import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./../index.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FlowStudio | Instagram DM Automation & Lead Generation",
  description: "The all-in-one studio for Instagram creators to automate DMs, manage leads, and grow their audience effortlessly.",
};

import { Providers } from "@/components/Providers";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Auth session error (possibly stale cookies):", error);
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} font-sans h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
