import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header"; // Importamos o Header aqui
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Metadados Profissionais (SEO)
export const metadata: Metadata = {
  title: "Audio Scribe | Transcrição Inteligente",
  description: "Transforme áudio em texto formatado e pontuado em segundos usando Inteligência Artificial (Groq + Llama 3).",
  icons: {
    icon: "/favicon.ico", // Se tiver um ícone, ele aparece na aba
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Idioma correto e suppressHydrationWarning (ajuda com plugins de dark mode)
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-surface-base 
          text-txt-primary 
          min-h-screen 
          flex 
          flex-col
          transition-colors 
          duration-300
        `}
      >
        {/* 3. Header Global: Aparece em todas as páginas */}
        <Header />

        {/* 4. Container Principal: Centraliza e limita a largura */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}