"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, PackageOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [mounted, isAuthenticated, router])

  // Handle role selection
  const handleRoleSelection = (role: "admin" | "picker") => {
    if (role === "admin") {
      router.push("/login")
    } else {
      // For picker role, go directly to preparation page
      router.push("/app?mode=picker")
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
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-l-4 border-l-accent shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-accent/10">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                OMS
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Sistema de Gestión de Pedidos</CardTitle>
              <CardDescription>Selecciona tu rol para continuar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-accent hover:bg-accent/5"
              onClick={() => handleRoleSelection("admin")}
            >
              <LayoutDashboard className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Gestionar Pedidos</div>
                <div className="text-xs text-muted-foreground">Administración y Dashboard</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-accent hover:bg-accent/5"
              onClick={() => handleRoleSelection("picker")}
            >
              <PackageOpen className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Realizar Picking</div>
                <div className="text-xs text-muted-foreground">Preparación de pedidos</div>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-muted-foreground w-full">Sistema de Gestión de Pedidos v1.0</div>
        </CardFooter>
      </Card>

      <Toaster />
    </main>
  )
}
