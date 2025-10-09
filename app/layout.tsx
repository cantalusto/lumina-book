import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Lúmina - Descoberta Literária Inteligente",
  description: "Uma plataforma inovadora de recomendação de livros que combina IA, comunidade e experiências visuais imersivas.",
  keywords: ["livros", "leitura", "recomendação", "clubes de leitura", "IA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
