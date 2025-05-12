"use client"

import { useEffect, useState } from "react"
import { CheckIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const themes = [
  {
    name: "Azul (Default)",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    class: "theme-blue",
  },
  {
    name: "Verde",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    class: "theme-green",
  },
  {
    name: "Violeta",
    primaryColor: "hsl(262.1 83.3% 57.8%)",
    class: "theme-violet",
  },
  {
    name: "Rojo",
    primaryColor: "hsl(346.8 77.2% 49.8%)",
    class: "theme-red",
  },
  {
    name: "Naranja",
    primaryColor: "hsl(24.6 95% 53.1%)",
    class: "theme-orange",
  },
]

const appearances = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Redondeado",
    value: "rounded",
  },
]

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [activeAppearance, setActiveAppearance] = useState<string>("default")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Detectar tema activo
    const html = document.documentElement
    const currentTheme = Array.from(html.classList).find((className) => className.startsWith("theme-"))

    setActiveTheme(currentTheme || null)

    // Detectar apariencia activa
    if (html.classList.contains("rounded-theme")) {
      setActiveAppearance("rounded")
    } else {
      setActiveAppearance("default")
    }
  }, [])

  function applyTheme(theme: string) {
    const html = document.documentElement

    // Eliminar temas anteriores
    themes.forEach((t) => {
      html.classList.remove(t.class)
    })

    // Aplicar nuevo tema
    if (theme !== "default") {
      html.classList.add(theme)
    }

    setActiveTheme(theme === "default" ? null : theme)

    // Guardar preferencia
    localStorage.setItem("selectedTheme", theme)
  }

  function applyAppearance(appearance: string) {
    const html = document.documentElement

    if (appearance === "rounded") {
      html.classList.add("rounded-theme")
    } else {
      html.classList.remove("rounded-theme")
    }

    setActiveAppearance(appearance)

    // Guardar preferencia
    localStorage.setItem("selectedAppearance", appearance)
  }

  if (!mounted) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Personalizar tema</DialogTitle>
            <DialogDescription>Personaliza la apariencia de la aplicación según tus preferencias.</DialogDescription>
          </DialogHeader>
          <ThemeCustomizerContent
            activeTheme={activeTheme}
            activeAppearance={activeAppearance}
            onThemeChange={applyTheme}
            onAppearanceChange={applyAppearance}
            onModeChange={setTheme}
            currentMode={theme}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Personalizar tema</DrawerTitle>
          <DrawerDescription>Personaliza la apariencia de la aplicación según tus preferencias.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <ThemeCustomizerContent
            activeTheme={activeTheme}
            activeAppearance={activeAppearance}
            onThemeChange={applyTheme}
            onAppearanceChange={applyAppearance}
            onModeChange={setTheme}
            currentMode={theme}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface ThemeCustomizerContentProps {
  activeTheme: string | null
  activeAppearance: string
  onThemeChange: (theme: string) => void
  onAppearanceChange: (appearance: string) => void
  onModeChange: (mode: string) => void
  currentMode?: string
}

function ThemeCustomizerContent({
  activeTheme,
  activeAppearance,
  onThemeChange,
  onAppearanceChange,
  onModeChange,
  currentMode,
}: ThemeCustomizerContentProps) {
  return (
    <Tabs defaultValue="color">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="color" className="flex-1">
          Color
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex-1">
          Apariencia
        </TabsTrigger>
      </TabsList>
      <TabsContent value="color" className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onThemeChange("default")}
            className={cn("justify-start px-3 border-2", !activeTheme && "border-primary")}
          >
            <span className="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[#0284c7]">
              {!activeTheme && <CheckIcon className="h-4 w-4 text-white" />}
            </span>
            Default
          </Button>
          {themes.map((theme) => (
            <Button
              key={theme.class}
              variant="outline"
              size="sm"
              onClick={() => onThemeChange(theme.class)}
              className={cn("justify-start px-3 border-2", activeTheme === theme.class && "border-primary")}
            >
              <span
                className="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {activeTheme === theme.class && <CheckIcon className="h-4 w-4 text-white" />}
              </span>
              {theme.name.split(" ")[0]}
            </Button>
          ))}
        </div>
        <Separator />
        <div>
          <h3 className="text-sm font-medium mb-2">Modo</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModeChange("light")}
              className={cn("justify-start px-3 border-2", currentMode === "light" && "border-primary")}
            >
              <span className="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[#f8fafc] border">
                {currentMode === "light" && <CheckIcon className="h-4 w-4 text-black" />}
              </span>
              Claro
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModeChange("dark")}
              className={cn("justify-start px-3 border-2", currentMode === "dark" && "border-primary")}
            >
              <span className="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[#020817]">
                {currentMode === "dark" && <CheckIcon className="h-4 w-4 text-white" />}
              </span>
              Oscuro
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModeChange("system")}
              className={cn(
                "justify-start px-3 border-2",
                (currentMode === "system" || !currentMode) && "border-primary",
              )}
            >
              <span className="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-gradient-to-br from-[#f8fafc] to-[#020817]">
                {(currentMode === "system" || !currentMode) && <CheckIcon className="h-4 w-4 text-white" />}
              </span>
              Sistema
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="appearance" className="space-y-4">
        <RadioGroup defaultValue={activeAppearance} onValueChange={onAppearanceChange}>
          {appearances.map((appearance) => (
            <div key={appearance.value} className="flex items-center space-x-2">
              <RadioGroupItem value={appearance.value} id={`appearance-${appearance.value}`} />
              <Label htmlFor={`appearance-${appearance.value}`}>{appearance.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </TabsContent>
    </Tabs>
  )
}
