import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Glucofy",
  description: "Smart Diabetes Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}

          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
            expand={false}
            visibleToasts={3}
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl shadow-lg border border-gray-200",
                title:
                  "text-sm font-semibold",
                description:
                  "text-xs text-gray-500",
              },
            }}
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}