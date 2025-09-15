import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";
import MobileRefreshButton from "@/components/MobileRefreshButton";
import CacheBuster from "@/components/CacheBuster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeuPortalFit - Saúde dos Brasileiros nos EUA",
  description: "Avaliação gratuita de bem-estar personalizada para brasileiros nos Estados Unidos",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MeuPortalFit",
  },
  icons: {
    icon: [
      { url: "/logo-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/logo-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/logo-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/logo-192x192.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "MeuPortalFit - Saúde dos Brasileiros nos EUA",
    description: "Avaliação gratuita de bem-estar personalizada para brasileiros nos Estados Unidos",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MeuPortalFit" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MeuPortalFit" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CacheBuster />
        <PWAInstaller />
        <MobileRefreshButton />
      </body>
    </html>
  );
}
