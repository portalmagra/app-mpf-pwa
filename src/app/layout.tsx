import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";
import NuclearCacheClear from "@/components/NuclearCacheClear";
import CacheClearer from "@/components/CacheClearer";
import NotificationManager from "@/components/NotificationManager";
import IOSUpdateManager from "@/components/IOSUpdateManager";
import ForceUpdate from "@/components/ForceUpdate";
import NotificationReminder from "@/components/NotificationReminder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeuPortalFit - Wellness para Brasileiros nos EUA",
  description: "🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MeuPortalFit",
  },
  // Meta tags específicas para WhatsApp
  other: {
    "whatsapp:phone": "+17862535032",
    "whatsapp:message": "Olá! Encontrei o MeuPortalFit - app brasileiro para saúde e bem-estar nos EUA! 🇧🇷✨",
  },
  icons: {
    icon: [
      { url: "/logo-variante-5.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/logo-variante-5.svg", sizes: "512x512", type: "image/svg+xml" },
      { url: "/logo-variante-5.svg", sizes: "400x400", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/logo-final-solo-m.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/logo-final-solo-m.svg", sizes: "400x400", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "MeuPortalFit - Wellness para Brasileiros nos EUA",
    description: "🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032",
    type: "website",
    locale: "pt_BR",
    url: "https://app.meuportalfit.com",
    siteName: "MeuPortalFit",
    images: [
      {
        url: "https://app.meuportalfit.com/whatsapp-preview.png",
        width: 400,
        height: 300,
        alt: "MeuPortalFit - Brasileiros nos EUA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeuPortalFit - Wellness para Brasileiros nos EUA",
    description: "🇧🇷 App brasileiro para sua saúde e bem-estar nos Estados Unidos! ✨ Avaliação gratuita por IA • 📚 eBooks exclusivos • 🍽️ Receitas brasileiras • 👩‍⚕️ Coach especializada • 💬 WhatsApp: (786) 253-5032",
    images: ["https://app.meuportalfit.com/whatsapp-preview.png"],
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
        <link rel="apple-touch-icon" href="/logo-final-solo-m-192x192.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MeuPortalFit" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="400x400" href="/logo-final-completo-32x32.png" />
        <link rel="icon" type="image/svg+xml" sizes="400x400" href="/logo-final-solo-m-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MeuPortalFit" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
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
                <NotificationManager appId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''} />
                <IOSUpdateManager />
                <ForceUpdate />
                <NotificationReminder />
      </body>
    </html>
  );
}
