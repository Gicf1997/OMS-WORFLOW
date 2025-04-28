"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, RefreshCw, Moon, Sun, Settings, LayoutDashboard, PackageOpen, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [accentColor, setAccentColor] = useState("blue")
  const [loading, setLoading] = useState(true)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Define available accent colors
  const accentColors = [
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "purple", label: "Morado", class: "bg-purple-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "orange", label: "Naranja", class: "bg-orange-500" },
    { value: "red", label: "Rojo", class: "bg-red-500" },
    { value: "teal", label: "Turquesa", class: "bg-teal-500" },
  ]

  const apps = [
    {
      id: "admin",
      name: "Administración",
      url: "https://script.google.com/macros/s/AKfycbwX7pmNj9iyXicZmHfaPb4lzJGz0N15Y6lNBTBtSyw-qIuWoi9GsK7tSs-ZH1V4f1Oh/exec",
      description: "Panel de administración del sistema de gestión de pedidos",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      id: "prep",
      name: "Preparación",
      url: "https://script.google.com/macros/s/AKfycbzJ9lmty8W28vFCfcn-7grdyawGn8W5vubegNHOt1-ZkKx3ovkaXurjZS7zGuErfnMC/exec",
      description: "Aplicación para la preparación de pedidos",
      icon: <PackageOpen className="h-4 w-4 mr-2" />,
    },
  ]

  // Apply the selected accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor)
    document.documentElement.setAttribute("data-accent", accentColor)
  }, [accentColor])

  // Avoid hydration mismatch and handle loading state
  useEffect(() => {
    setMounted(true)

    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle iframe loading
  const handleIframeLoad = () => {
    // You can add additional logic here if needed
  }

  const toggleFullscreen = () => {
    const iframe = document.querySelector(".app-iframe") as HTMLElement

    if (!document.fullscreenElement) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const refreshIframe = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Show a minimal UI while loading theme
  if (!mounted) {
    return null
  }

  // Get the current theme for styling
  const currentTheme = resolvedTheme || theme || "light"
  const isDark = currentTheme === "dark"

  return (
    <main className={`min-h-screen bg-background transition-colors duration-300`}>
      {/* Loading Banner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500">
          <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card border shadow-lg">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">
                  OMS
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Cargando Sistema</h2>
            <p className="text-sm text-muted-foreground">Preparando su interfaz de gestión...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4">
        <Card
          className={cn(
            "mb-6 border-l-4 border-l-accent shadow-md transition-all duration-300",
            isDark ? "bg-card text-card-foreground" : "",
          )}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-3 p-2 rounded-full bg-accent/10">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                    OMS
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">Sistema de Gestión de Pedidos</CardTitle>
                  <CardDescription className="text-sm">
                    Accede a las aplicaciones de administración y preparación desde una sola interfaz
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent/10 hover:text-accent"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 hover:text-accent">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="border-l-accent border-l-4">
                    <SheetHeader>
                      <SheetTitle>Personalización</SheetTitle>
                      <SheetDescription>Personaliza la apariencia de tu interfaz OMS</SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <h3 className="text-sm font-medium mb-3">Color de acento</h3>
                      <RadioGroup value={accentColor} onValueChange={setAccentColor} className="grid grid-cols-3 gap-2">
                        {accentColors.map((color) => (
                          <div key={color.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                            <Label
                              htmlFor={`color-${color.value}`}
                              className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer border-2 ${
                                accentColor === color.value ? "border-accent" : "border-transparent hover:border-muted"
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`}></div>
                                <span className="text-sm">{color.label}</span>
                              </div>
                              {accentColor === color.value && <Check className="h-4 w-4 text-accent" />}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <Separator />
                    <div className="py-6">
                      <h3 className="text-sm font-medium mb-3">Tema</h3>
                      <RadioGroup value={theme} onValueChange={setTheme} className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="theme-light" />
                          <Label htmlFor="theme-light" className="flex items-center">
                            <Sun className="h-4 w-4 mr-2" />
                            Claro
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="theme-dark" />
                          <Label htmlFor="theme-dark" className="flex items-center">
                            <Moon className="h-4 w-4 mr-2" />
                            Oscuro
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="theme-system" />
                          <Label htmlFor="theme-system">Sistema</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="admin" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className={cn("bg-background border", isDark ? "border-border" : "")}>
              {apps.map((app) => (
                <TabsTrigger
                  key={app.id}
                  value={app.id}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <div className="flex items-center">
                    {app.icon}
                    {app.name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={refreshIframe}
                title="Refrescar aplicación"
                className="rounded-full hover:bg-accent/10 hover:text-accent"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title="Pantalla completa"
                className="rounded-full hover:bg-accent/10 hover:text-accent"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {apps.map((app) => (
            <TabsContent key={app.id} value={app.id} className="mt-0">
              <Card
                className={cn(
                  "overflow-hidden shadow-lg border-t-4 border-t-accent transition-all duration-300",
                  isDark ? "bg-card text-card-foreground" : "",
                )}
              >
                <CardHeader className={cn("bg-muted/30 py-3", isDark ? "bg-muted/10" : "")}>
                  <div className="flex items-center">
                    {app.icon}
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className={cn(
                      "w-full h-[calc(100vh-280px)] rounded-b-lg overflow-hidden relative",
                      isDark ? "bg-background" : "bg-background",
                    )}
                  >
                    <iframe
                      key={refreshKey}
                      src={app.url}
                      className="app-iframe w-full h-full border-0"
                      title={app.name}
                      allow="fullscreen"
                      onLoad={handleIframeLoad}
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
