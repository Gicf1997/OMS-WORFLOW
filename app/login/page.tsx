"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Por favor, introduce usuario y contraseña",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo al panel de control...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Usuario o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
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
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </main>
  )
}
