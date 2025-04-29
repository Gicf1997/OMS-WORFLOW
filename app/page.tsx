"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Maximize2,
  RefreshCw,
  Moon,
  Sun,
  Settings,
  LayoutDashboard,
  PackageOpen,
  Check,
  WifiOff,
  Keyboard,
  Download,
  Share2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const searchParams = useSearchParams()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [accentColor, setAccentColor] = useState("blue")
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(true)
  const [lowDataMode, setLowDataMode] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const deferredPromptRef = useRef<any>(null)
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

  // Keyboard shortcuts
  const keyboardShortcuts = [
    { key: "Alt + 1", description: "Ir a Administración" },
    { key: "Alt + 2", description: "Ir a Preparación" },
    { key: "Alt + R", description: "Refrescar aplicación actual" },
    { key: "Alt + F", description: "Pantalla completa" },
    { key: "Alt + T", description: "Cambiar tema claro/oscuro" },
    { key: "Alt + S", description: "Abrir configuración" },
    { key: "Alt + H", description: "Mostrar atajos de teclado" },
    { key: "Esc", description: "Salir de pantalla completa" },
  ]

  // Apply the selected accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor)
    document.documentElement.setAttribute("data-accent", accentColor)
  }, [accentColor])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Conexión restablecida",
        description: "Tu dispositivo está conectado a internet",
        duration: 3000,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Sin conexión",
        description: "Trabajando en modo offline",
        variant: "destructive",
        duration: 5000,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err)
          },
        )
      })
    }
  }, [])

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPromptRef.current = e
      // Update UI to notify the user they can add to home screen
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case "1":
            document.querySelector('[data-value="admin"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
            break
          case "2":
            document.querySelector('[data-value="prep"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
            break
          case "r":
          case "R":
            refreshIframe()
            break
          case "f":
          case "F":
            toggleFullscreen()
            break
          case "t":
          case "T":
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
            break
          case "s":
          case "S":
            document
              .querySelector('[data-settings-trigger="true"]')
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
            break
          case "h":
          case "H":
            setShowKeyboardShortcuts(true)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [resolvedTheme, setTheme])

  // Avoid hydration mismatch and handle loading state
  useEffect(() => {
    setMounted(true)

    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Check for app parameter in URL
  useEffect(() => {
    const appParam = searchParams.get("app")
    if (appParam && (appParam === "admin" || appParam === "prep")) {
      document.querySelector(`[data-value="${appParam}"]`)?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    }
  }, [searchParams, mounted])

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
    toast({
      title: "Actualizando",
      description: "Recargando la aplicación actual",
      duration: 2000,
    })
  }

  const installPwa = async () => {
    if (deferredPromptRef.current) {
      // Show the install prompt
      deferredPromptRef.current.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPromptRef.current.userChoice

      // We've used the prompt, and can't use it again, discard it
      deferredPromptRef.current = null
      setIsInstallable(false)

      if (outcome === "accepted") {
        toast({
          title: "¡Instalación exitosa!",
          description: "La aplicación se ha instalado correctamente",
          duration: 3000,
        })
      }
    }
  }

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sistema de Gestión de Pedidos",
          text: "Accede a nuestro Sistema de Gestión de Pedidos",
          url: window.location.href,
        })
        toast({
          title: "¡Compartido!",
          description: "Gracias por compartir nuestra aplicación",
          duration: 2000,
        })
      } catch (error) {
        console.error("Error al compartir:", error)
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "URL copiada al portapapeles",
        duration: 2000,
      })
    }
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

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-40 bg-destructive text-destructive-foreground p-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>Sin conexión - Modo offline</span>
          </div>
        </div>
      )}

      <div className={cn("container mx-auto p-4", !isOnline && "pt-10")}>
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
                {isInstallable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-accent/10 hover:text-accent"
                          onClick={installPwa}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Instalar aplicación</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/10 hover:text-accent"
                        onClick={shareApp}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compartir</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/10 hover:text-accent"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                      >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cambiar tema</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-accent/10 hover:text-accent"
                          >
                            <Keyboard className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Atajos de teclado</DialogTitle>
                            <DialogDescription>
                              Utiliza estos atajos para navegar rápidamente por la aplicación
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {keyboardShortcuts.map((shortcut, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="font-medium">{shortcut.key}</span>
                                <span className="text-muted-foreground">{shortcut.description}</span>
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cerrar</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Atajos de teclado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-accent/10 hover:text-accent"
                      data-settings-trigger="true"
                    >
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
                    <Separator />
                    <div className="py-6">
                      <h3 className="text-sm font-medium mb-3">Opciones adicionales</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="mobile-nav">Barra de navegación móvil</Label>
                            <p className="text-xs text-muted-foreground">
                              Mostrar barra de navegación en dispositivos móviles
                            </p>
                          </div>
                          <Switch id="mobile-nav" checked={showMobileNav} onCheckedChange={setShowMobileNav} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="low-data">Modo ahorro de datos</Label>
                            <p className="text-xs text-muted-foreground">
                              Reduce el consumo de datos en conexiones limitadas
                            </p>
                          </div>
                          <Switch id="low-data" checked={lowDataMode} onCheckedChange={setLowDataMode} />
                        </div>
                      </div>
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
                  data-value={app.id}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={refreshIframe}
                      title="Refrescar aplicación"
                      className="rounded-full hover:bg-accent/10 hover:text-accent"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refrescar (Alt+R)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFullscreen}
                      title="Pantalla completa"
                      className="rounded-full hover:bg-accent/10 hover:text-accent"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pantalla completa (Alt+F)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                    {lowDataMode && (
                      <div className="absolute top-0 left-0 right-0 bg-accent/10 text-center py-1 text-xs">
                        Modo ahorro de datos activado
                      </div>
                    )}
                    <iframe
                      key={refreshKey}
                      src={app.url}
                      className={cn("app-iframe w-full h-full border-0", lowDataMode && "filter grayscale")}
                      title={app.name}
                      allow="fullscreen"
                      onLoad={handleIframeLoad}
                      loading={lowDataMode ? "lazy" : "eager"}
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile Navigation Bar */}
      {showMobileNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-40">
          <div className="flex justify-around items-center">
            {apps.map((app) => (
              <Button
                key={app.id}
                variant="ghost"
                className="flex flex-col items-center py-2 px-3 rounded-lg"
                onClick={() => {
                  document
                    .querySelector(`[data-value="${app.id}"]`)
                    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                }}
              >
                <div className="mb-1">{app.icon}</div>
                <span className="text-xs">{app.name}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 px-3 rounded-lg"
              onClick={() => {
                document
                  .querySelector('[data-settings-trigger="true"]')
                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
              }}
            >
              <Settings className="h-4 w-4 mb-1" />
              <span className="text-xs">Ajustes</span>
            </Button>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster />
    </main>
  )
}
