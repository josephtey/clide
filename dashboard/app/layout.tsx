import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Dashboard",
  description: "Real-time monitoring for Claude agent tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
