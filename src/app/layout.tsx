import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/hooks";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "referkaro - Get referred. Get hired.",
  description:
    "A trusted referral-based job board connecting people who can refer with those seeking career opportunities.",
  keywords: ["jobs", "referral", "hiring", "career", "recruitment"],
  authors: [{ name: "referkaro" }],
  openGraph: {
    title: "referkaro - Get referred. Get hired.",
    description:
      "A trusted referral-based job board connecting people who can refer with those seeking career opportunities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
