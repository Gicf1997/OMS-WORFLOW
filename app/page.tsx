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
  ChevronLeft,
  ChevronRight,
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
import { DashboardIcon } from "@/components/dashboard-icon"
import { SkipNavLink, SkipNavContent } from "@/components/skip-nav"
import { useSwipeable } from "@/hooks/use-swipeable"

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
  const [activeTab, setActiveTab] = useState("dashboard")
  const [fontSize, setFontSize] = useState("normal")
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
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
      id: "dashboard",
      name: "Dashboard",
      url: "https://script.google.com/macros/s/AKfycbyj4h8m5_44SBNDpsMGcO4AJTNkpqO7cHRy_vnEYYcIU_DZHHT5IS4u5exMX8lOac75/exec",
      description: "Panel de control con métricas y estadísticas del sistema",
      icon: <DashboardIcon className="h-4 w-4 mr-2" aria-hidden="true" />,
      shortcut: "0",
    },
    {
      id: "admin",
      name: "Administración",
      url: "https://script.google.com/macros/s/AKfycbwX7pmNj9iyXicZmHfaPb4lzJGz0N15Y6lNBTBtSyw-qIuWoi9GsK7tSs-ZH1V4f1Oh/exec",
      description: "Panel de administración del sistema de gestión de pedidos",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" aria-hidden="true" />,
      shortcut: "1",
    },
    {
      id: "prep",
      name: "Preparación",
      url: "https://script.google.com/macros/s/AKfycbycWrHAKCLpRCJ4zCs6YEF8VW93jjhR04FprhAGUX18ETWFEI0dJs-4BH9vX-58QbIM/exec",
      description: "Aplicación para la preparación de pedidos",
      icon: <PackageOpen className="h-4 w-4 mr-2" aria-hidden="true" />,
      shortcut: "2",
    },
  ]

  // Keyboard shortcuts
  const keyboardShortcuts = [
    { key: "Alt + 0", description: "Ir a Dashboard" },
    { key: "Alt + 1", description: "Ir a Administración" },
    { key: "Alt + 2", description: "Ir a Preparación" },
    { key: "Alt + R", description: "Refrescar aplicación actual" },
    { key: "Alt + F", description: "Pantalla completa" },
    { key: "Alt + T", description: "Cambiar tema claro/oscuro" },
    { key: "Alt + S", description: "Abrir configuración" },
    { key: "Alt + H", description: "Mostrar atajos de teclado" },
    { key: "Esc", description: "Salir de pantalla completa" },
    { key: "Flecha izquierda", description: "Aplicación anterior" },
    { key: "Flecha derecha", description: "Aplicación siguiente" },
  ]

  // Apply the selected accent color and accessibility settings to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor)
    document.documentElement.setAttribute("data-accent", accentColor)

    // Apply font size
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg")
    if (fontSize === "small") document.documentElement.classList.add("text-sm")
    else if (fontSize === "large") document.documentElement.classList.add("text-lg")
    else document.documentElement.classList.add("text-base")

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply reduced motion
    if (reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [accentColor, fontSize, highContrast, reduceMotion])

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
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.altKey) {
        switch (e.key) {
          case "0":
            switchToApp("dashboard")
            break
          case "1":
            switchToApp("admin")
            break
          case "2":
            switchToApp("prep")
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
      } else {
        // Navigation with arrow keys
        switch (e.key) {
          case "ArrowLeft":
            navigateToAdjacentApp(-1)
            break
          case "ArrowRight":
            navigateToAdjacentApp(1)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [resolvedTheme, setTheme, activeTab])

  // Avoid hydration mismatch and handle loading state
  useEffect(() => {
    setMounted(true)

    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Check for app parameter in URL and set active tab
  useEffect(() => {
    const appParam = searchParams.get("app")
    if (appParam && apps.some((app) => app.id === appParam)) {
      setActiveTab(appParam)
      switchToApp(appParam)
    }
  }, [searchParams, mounted, apps])

  // Load user preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFontSize = localStorage.getItem("oms-font-size") || "normal"
      const savedHighContrast = localStorage.getItem("oms-high-contrast") === "true"
      const savedReduceMotion = localStorage.getItem("oms-reduce-motion") === "true"
      const savedShowMobileNav = localStorage.getItem("oms-show-mobile-nav") !== "false"
      const savedLowDataMode = localStorage.getItem("oms-low-data-mode") === "true"
      const savedAccentColor = localStorage.getItem("oms-accent-color") || "blue"

      setFontSize(savedFontSize)
      setHighContrast(savedHighContrast)
      setReduceMotion(savedReduceMotion)
      setShowMobileNav(savedShowMobileNav)
      setLowDataMode(savedLowDataMode)
      setAccentColor(savedAccentColor)
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      localStorage.setItem("oms-font-size", fontSize)
      localStorage.setItem("oms-high-contrast", highContrast.toString())
      localStorage.setItem("oms-reduce-motion", reduceMotion.toString())
      localStorage.setItem("oms-show-mobile-nav", showMobileNav.toString())
      localStorage.setItem("oms-low-data-mode", lowDataMode.toString())
      localStorage.setItem("oms-accent-color", accentColor)
    }
  }, [fontSize, highContrast, reduceMotion, showMobileNav, lowDataMode, accentColor, mounted])

  // Handle iframe loading
  const handleIframeLoad = () => {
    // You can add additional logic here if needed
  }

  // Switch to a specific app
  const switchToApp = (appId: string) => {
    setActiveTab(appId)
    document.querySelector(`[data-value="${appId}"]`)?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  }

  // Navigate to adjacent app
  const navigateToAdjacentApp = (direction: number) => {
    const currentIndex = apps.findIndex((app) => app.id === activeTab)
    if (currentIndex === -1) return

    const nextIndex = (currentIndex + direction + apps.length) % apps.length
    switchToApp(apps[nextIndex].id)
  }

  // Setup swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateToAdjacentApp(1),
    onSwipedRight: () => navigateToAdjacentApp(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  })

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
    <>
      <SkipNavLink />
      <main
        className={cn(
          "min-h-screen bg-background transition-colors",
          reduceMotion ? "transition-none" : "duration-300",
          highContrast && "high-contrast-mode",
          fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base",
        )}
      >
        {/* Loading Banner */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500">
            <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card border shadow-lg">
              <div className="relative">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent",
                    !reduceMotion && "animate-spin",
                  )}
                ></div>
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
              <WifiOff className="h-4 w-4" aria-hidden="true" />
              <span>Sin conexión - Modo offline</span>
            </div>
          </div>
        )}

        <div className={cn("container mx-auto px-2 sm:px-4", !isOnline && "pt-10")}>
          <SkipNavContent />
          <Card
            className={cn(
              "mb-4 sm:mb-6 border-l-4 border-l-accent shadow-md transition-all",
              reduceMotion ? "transition-none" : "duration-300",
              isDark ? "bg-card text-card-foreground" : "",
            )}
          >
            <CardHeader className="py-3 px-3 sm:px-6 sm:py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-2 sm:mr-3 p-1 sm:p-2 rounded-full bg-accent/10">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                      <span className="sr-only">Sistema de Gestión de Pedidos</span>
                      OMS
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-2xl">Sistema de Gestión de Pedidos</CardTitle>
                    <CardDescription className="text-xs sm:text-sm hidden sm:block">
                      Accede a las aplicaciones de administración y preparación desde una sola interfaz
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  {isInstallable && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full hover:bg-accent/10 hover:text-accent"
                            onClick={installPwa}
                            aria-label="Instalar aplicación"
                          >
                            <Download className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
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
                          aria-label="Compartir aplicación"
                        >
                          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
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
                          aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                        >
                          {isDark ? (
                            <Sun className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          ) : (
                            <Moon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          )}
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
                        <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-accent/10 hover:text-accent"
                              aria-label="Ver atajos de teclado"
                            >
                              <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
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
                        aria-label="Configuración"
                      >
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="border-l-accent border-l-4 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Personalización</SheetTitle>
                        <SheetDescription>Personaliza la apariencia de tu interfaz OMS</SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <h3 className="text-sm font-medium mb-3">Color de acento</h3>
                        <RadioGroup
                          value={accentColor}
                          onValueChange={setAccentColor}
                          className="grid grid-cols-3 gap-2"
                        >
                          {accentColors.map((color) => (
                            <div key={color.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                              <Label
                                htmlFor={`color-${color.value}`}
                                className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer border-2 ${
                                  accentColor === color.value
                                    ? "border-accent"
                                    : "border-transparent hover:border-muted"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`}></div>
                                  <span className="text-sm">{color.label}</span>
                                </div>
                                {accentColor === color.value && (
                                  <Check className="h-4 w-4 text-accent" aria-hidden="true" />
                                )}
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
                              <Sun className="h-4 w-4 mr-2" aria-hidden="true" />
                              Claro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="theme-dark" />
                            <Label htmlFor="theme-dark" className="flex items-center">
                              <Moon className="h-4 w-4 mr-2" aria-hidden="true" />
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
                        <h3 className="text-sm font-medium mb-3">Accesibilidad</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="font-size">Tamaño de texto</Label>
                            </div>
                            <select
                              id="font-size"
                              value={fontSize}
                              onChange={(e) => setFontSize(e.target.value)}
                              className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                              aria-label="Seleccionar tamaño de texto"
                            >
                              <option value="small">Pequeño</option>
                              <option value="normal">Normal</option>
                              <option value="large">Grande</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="high-contrast">Alto contraste</Label>
                              <p className="text-xs text-muted-foreground">
                                Mejora el contraste para mayor legibilidad
                              </p>
                            </div>
                            <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="reduce-motion">Reducir movimiento</Label>
                              <p className="text-xs text-muted-foreground">Minimiza animaciones y transiciones</p>
                            </div>
                            <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
                          </div>
                        </div>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1 hidden sm:flex"
                  onClick={() => navigateToAdjacentApp(-1)}
                  aria-label="Aplicación anterior"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <TabsList className={cn("bg-background border h-9 sm:h-10", isDark ? "border-border" : "")}>
                  {apps.map((app) => (
                    <TabsTrigger
                      key={app.id}
                      value={app.id}
                      data-value={app.id}
                      className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground h-8 sm:h-9 px-2 sm:px-3"
                      aria-label={`Ir a ${app.name} (Alt+${app.shortcut})`}
                    >
                      <div className="flex items-center">
                        {app.icon}
                        <span className="hidden sm:inline">{app.name}</span>
                        <span className="sm:hidden">{app.name.substring(0, 1)}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 hidden sm:flex"
                  onClick={() => navigateToAdjacentApp(1)}
                  aria-label="Aplicación siguiente"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="flex gap-1 sm:gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={refreshIframe}
                        aria-label="Refrescar aplicación (Alt+R)"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent/10 hover:text-accent"
                      >
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
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
                        aria-label="Pantalla completa (Alt+F)"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent/10 hover:text-accent"
                      >
                        <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pantalla completa (Alt+F)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div {...swipeHandlers} className="touch-pan-y">
              {apps.map((app) => (
                <TabsContent key={app.id} value={app.id} className="mt-0">
                  <Card
                    className={cn(
                      "overflow-hidden shadow-lg border-t-4 border-t-accent transition-all",
                      reduceMotion ? "transition-none" : "duration-300",
                      isDark ? "bg-card text-card-foreground" : "",
                    )}
                  >
                    <CardHeader className={cn("bg-muted/30 py-2 sm:py-3", isDark ? "bg-muted/10" : "")}>
                      <div className="flex items-center">
                        {app.icon}
                        <div>
                          <CardTitle className="text-base sm:text-lg">{app.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm hidden sm:block">
                            {app.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div
                        className={cn(
                          "w-full rounded-b-lg overflow-hidden relative",
                          "h-[calc(100vh-230px)] sm:h-[calc(100vh-280px)]",
                          isDark ? "bg-background" : "bg-background",
                        )}
                      >
                        {lowDataMode && (
                          <div className="absolute top-0 left-0 right-0 bg-accent/10 text-center py-1 text-xs z-10">
                            Modo ahorro de datos activado
                          </div>
                        )}
                        <iframe
                          key={`${app.id}-${refreshKey}`}
                          src={app.url}
                          className={cn(
                            "app-iframe w-full h-full border-0",
                            lowDataMode && "filter grayscale",
                            reduceMotion && "scroll-smooth",
                          )}
                          title={app.name}
                          allow="fullscreen"
                          onLoad={handleIframeLoad}
                          loading={lowDataMode ? "lazy" : "eager"}
                          aria-label={`Aplicación ${app.name}`}
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
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
                  className={cn(
                    "flex flex-col items-center py-2 px-1 rounded-lg",
                    activeTab === app.id && "bg-accent/10 text-accent",
                  )}
                  onClick={() => switchToApp(app.id)}
                  aria-label={`Ir a ${app.name}`}
                  aria-current={activeTab === app.id ? "page" : undefined}
                >
                  <div className="mb-1">{app.icon}</div>
                  <span className="text-xs">{app.name}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="flex flex-col items-center py-2 px-1 rounded-lg"
                onClick={() => {
                  document
                    .querySelector('[data-settings-trigger="true"]')
                    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                }}
                aria-label="Ajustes"
              >
                <Settings className="h-4 w-4 mb-1" aria-hidden="true" />
                <span className="text-xs">Ajustes</span>
              </Button>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        <Toaster />
      </main>
    </>
  )
}
