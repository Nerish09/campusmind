import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusMind",
  description: "An AI-powered operating system for college students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
