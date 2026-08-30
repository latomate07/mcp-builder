import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { McpProvider } from "@/context/mcp-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MCP Builder — Créez, Déployez et Surveillez vos serveurs MCP",
  description: "Plateforme moderne de création et gestion de serveurs Model Context Protocol (MCP) pour Claude Desktop, Cursor et agents autonomes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <McpProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </McpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
