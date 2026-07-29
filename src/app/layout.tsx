import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Class 365 — Cloud Education Management Platform",
  description:
    "Student management software for Kindy to Year 13 schools in Vanuatu — attendance, grades, communications, SIS, and billing in Vanuatu Vatu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
