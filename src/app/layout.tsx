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
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VY8X9VW8EF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VY8X9VW8EF', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M7CTTL5S');
            `,
          }}
        />
        
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2741150369428105');
              fbq('track', 'PageView');
            `,
          }}
        />
        
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M7CTTL5S"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2741150369428105&ev=PageView&noscript=1"
          />
        </noscript>
        
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
