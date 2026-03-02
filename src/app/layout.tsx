import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "NestedFusion — AI Automation Consultancy",
    template: "%s | NestedFusion",
  },
  description:
    "AI-powered workflow automation, custom GPT development, and full-stack solutions. Scale your business by analyzing every step.",
  keywords: [
    "AI automation",
    "n8n",
    "Make.com",
    "workflow automation",
    "custom GPT",
    "full-stack development",
    "AI consulting",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
