import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import "@workspace/ui/globals.css"

export const metadata: Metadata = {
  title: "Chat with Webpage",
  description: "Load any webpage and have an AI conversation about its content",
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-screen h-screen bg-background flex flex-col`}
      >
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
