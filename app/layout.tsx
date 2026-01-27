import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dana_bozzetto",
  description: "Dana_bozzetto",
  generator: "Dana_bozzetto.app",
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
      { url: "/logo-icon.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      // { url: '/logo-icon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ["/logo-icon.png"],
    apple: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div
          className="min-h-screen bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/background-image.jpg')" }}
        >
          {/* optional overlay for readability */}
          <div className="min-h-screen bg-black/40 backdrop-blur-sm">{children}</div>
        </div>

        <Analytics />
      </body>
    </html>
  );
}
