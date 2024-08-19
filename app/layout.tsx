import { ConvexNextjsProvider } from "convex-gold-nextjs/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App Title",
  description: "My app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexNextjsProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ConvexNextjsProvider>
  );
}
