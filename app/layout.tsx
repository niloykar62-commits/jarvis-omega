import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARVIS OMEGA - GOD MODE",
  description: "Advanced AI Assistant Created by Niloy Kar",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>JARVIS OMEGA - GOD MODE</title>
        <meta name="description" content="Advanced AI Assistant by Niloy Kar" />

        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22d3ee" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Jarvis-Ω" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* iOS icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Windows tile */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
      </head>
      <body className="bg-black">
        {children}

        {/* ✅ Service Worker Registration — makes app installable */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function (reg) {
                      console.log('[JARVIS-OMEGA] SW registered ✅', reg.scope);
                    })
                    .catch(function (err) {
                      console.warn('[JARVIS-OMEGA] SW failed ❌', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
