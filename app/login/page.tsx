"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Función para generar hash SHA-256
async function generarHash256(texto: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(texto)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generar hash de la contraseña
      const hash = await generarHash256(password)

      // URL del script de Google
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbzwAI_iR6jTwd3fj37NPKY5nkaJpV9EboEnbUZj7_4EYx7kQFRnujEBZYz9uBo4L5dxog/exec"

      // Construir URL con parámetros
      const url = `${scriptUrl}?usuario=${encodeURIComponent(username)}&hash=${encodeURIComponent(hash)}`

      // Realizar la solicitud GET
      const response = await fetch(url)
      const data = await response.json()

      if (data.rol) {
        // Verificar si el usuario tiene permisos de administrador
        if (data.rol !== "ADMIN") {
          toast({
            title: "Acceso restringido",
            description:
              "No tienes permisos de administrador para acceder a este panel. Utiliza la opción 'Realizar Picking' desde la página principal.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        // Guardar información del usuario en localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username,
            name: data.nombre || username,
            role: data.rol,
            isAuthenticated: true,
            theme: localStorage.getItem("theme") || "system",
          }),
        )

        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${data.nombre || username}`,
        })

        // Redirigir al portal
        router.push("/portal")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Usuario o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error de autenticación:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-muted/30 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
              <CardDescription className="text-center">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    placeholder="Ingrese su nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-background"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Nota: Solo los usuarios con rol de Administrador pueden acceder a este panel.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portal OS. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
