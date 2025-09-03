import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinFlow",
  description: "AI-powered bookkeeping & tax assistant for South African businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-finflow-light text-finflow-dark antialiased">
        {children}
      </body>
    </html>
  );
}
