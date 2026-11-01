import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BIT Patna Energy Audit",
    template: "%s · BIT Patna Energy Audit",
  },
  description:
    "A research dashboard for the electrical energy audit of BIT Mesra Off-Campus Patna.",
  keywords: [
    "energy audit",
    "BIT Patna",
    "electrical engineering",
    "campus energy",
  ],
  authors: [{ name: "Bhabya Bharti" }],
  openGraph: {
    title: "BIT Patna Energy Audit",
    description:
      "A measured look at campus electricity consumption, cost and opportunities for efficiency.",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f6f7f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
