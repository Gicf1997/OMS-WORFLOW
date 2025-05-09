"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/10 hover:text-accent"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cambiar tema</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
