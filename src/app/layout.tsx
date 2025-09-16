import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";
import NuclearCacheClear from "@/components/NuclearCacheClear";
import CacheClearer from "@/components/CacheClearer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Fit - Brasileiros nos EUA",
  description: "Saúde e bem-estar para brasileiros nos Estados Unidos. Receitas, produtos, avaliações personalizadas e muito mais!",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Portal Fit",
  },
  icons: {
    icon: [
      { url: "/icons/portal-fit-icon-192-v3.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/portal-fit-icon-512-v3.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/portal-fit-icon-180-ios.svg", sizes: "180x180", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "MeuPortalFit - Brasileiros nos EUA",
    description: "Saúde e bem-estar para brasileiros nos Estados Unidos. Receitas, produtos, avaliações personalizadas e muito mais!",
    type: "website",
    locale: "pt_BR",
    url: "https://meuportalfit.com",
    siteName: "MeuPortalFit",
    images: [
      {
        url: "/icons/icon-512x512.svg",
        width: 512,
        height: 512,
        alt: "MeuPortalFit - Brasileiros nos EUA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeuPortalFit - Brasileiros nos EUA",
    description: "Saúde e bem-estar para brasileiros nos Estados Unidos",
    images: ["/icons/icon-512x512.svg"],
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
        <link rel="apple-touch-icon" href="/icons/portal-fit-icon-180-ios.svg" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MeuPortalFit" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icons/portal-fit-icon-192-v3.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icons/portal-fit-icon-512-v3.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MeuPortalFit" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CacheClearer />
        <NuclearCacheClear />
        <PWAInstaller />
      </body>
    </html>
  );
}
