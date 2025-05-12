"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"
import { AppTabs } from "@/components/app-tabs"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { useToast } from "@/components/ui/use-toast"

interface User {
  username: string
  name?: string
  role: string
  isAuthenticated: boolean
  theme?: string
}

export default function Portal() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("preparacion")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [isDirectAccess, setIsDirectAccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const appParam = searchParams.get("app")
  const { toast } = useToast()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const storedUser = localStorage.getItem("user")

    if (appParam === "preparacion") {
      // Si viene de "Realizar Picking", no necesita autenticación
      setActiveTab("preparacion")
      setIsDirectAccess(true) // Marcar como acceso directo
    } else if (!storedUser) {
      // Si no hay usuario almacenado y no es "Realizar Picking", redirigir al login
      router.push("/login")
      return
    } else {
      // Si hay usuario almacenado, establecerlo en el estado
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Si el usuario no es admin, solo mostrar preparación
      if (parsedUser.role !== "ADMIN") {
        setActiveTab("preparacion")
      }
    }

    // Ajustar sidebar en móviles
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [router, appParam])

  const handleLogout = () => {
    // Guardar tema actual antes de cerrar sesión
    const theme = localStorage.getItem("theme") || "system"

    localStorage.removeItem("user")

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })

    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!isDirectAccess && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
            <h1 className="text-xl font-bold">Portal OS</h1>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="text-sm hidden md:block">
                <span className="text-muted-foreground">Usuario:</span>{" "}
                <span className="font-medium">{user.name || user.username}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowThemeCustomizer(true)}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Personalizar tema</span>
            </Button>
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Solo mostrar si no es acceso directo */}
        {!isDirectAccess && (
          <Sidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} user={user} isDirectAccess={isDirectAccess} />
        </main>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />
    </div>
  )
}
