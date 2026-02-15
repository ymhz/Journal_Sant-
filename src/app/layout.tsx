import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Journal Santé",
  description: "Suivi nutritionnel, hydratation & santé",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Journal Santé",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0f1a",
  viewportFit: "cover",
};

const globalCSS = `
*, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { height: 100%; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body { margin: 0; min-height: 100dvh; background: linear-gradient(180deg, #0a0f1a 0%, #0f1724 100%); color: #dce4ed; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #253347; border-radius: 3px; }
input, select, textarea, button { font-family: inherit; font-size: inherit; color: inherit; }
input[type="text"], input[type="number"], input[type="time"], input[type="date"], textarea, select { width: 100%; padding: 10px 12px; background: #151f2e; border: 1px solid #253347; border-radius: 8px; color: #dce4ed; font-family: 'JetBrains Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.15s; min-height: 44px; }
input:focus, select:focus, textarea:focus { border-color: #3b8beb; }
input::placeholder, textarea::placeholder { color: #3a4d63; }
select { cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7f96' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: #1a2738; border-radius: 3px; outline: none; cursor: pointer; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #3b8beb; border: 2px solid #0a0f1a; cursor: pointer; }
textarea { resize: vertical; min-height: 72px; }
button { cursor: pointer; border: none; background: transparent; padding: 0; min-height: 44px; touch-action: manipulation; }
.mono { font-family: 'JetBrains Mono', monospace; }
.label { display: block; font-size: 11px; color: #5e7490; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
.card { background: rgba(255,255,255,0.02); border: 1px solid #1a2738; border-radius: 12px; padding: 16px; }
.card-dark { background: #0d1520; border: 1px solid #1a2738; border-radius: 10px; padding: 14px; }
.badge { font-size: 11px; font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.tabs-scroll { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.tabs-scroll::-webkit-scrollbar { display: none; }
.safe-top { padding-top: env(safe-area-inset-top, 0); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
@media (min-width: 640px) { .responsive-container { max-width: 600px; margin: 0 auto; } }
@media (min-width: 1024px) { .responsive-container { max-width: 720px; } }
@media (display-mode: standalone) { body { padding-top: env(safe-area-inset-top, 0); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.2s ease-out; }
`;

const swScript = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(reg) { setInterval(function() { reg.update(); }, 3600000); })
      .catch(function() {});
  });
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon512.png" />
        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </body>
    </html>
  );
}
