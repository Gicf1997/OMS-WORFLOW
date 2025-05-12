"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Cargar preferencias guardadas
  useEffect(() => {
    const html = document.documentElement

    // Aplicar tema guardado
    const savedTheme = localStorage.getItem("selectedTheme")
    if (savedTheme && savedTheme !== "default") {
      html.classList.add(savedTheme)
    }

    // Aplicar apariencia guardada
    const savedAppearance = localStorage.getItem("selectedAppearance")
    if (savedAppearance === "rounded") {
      html.classList.add("rounded-theme")
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
