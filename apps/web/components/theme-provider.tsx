"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  )
}
