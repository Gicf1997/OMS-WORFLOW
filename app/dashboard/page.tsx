"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Users, PackageOpen } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, userRole, userName } = useAuth()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Check if user has admin role (case insensitive)
    if (userRole !== "admin") {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta sección",
        variant: "destructive",
      })
      router.push("/")
      return
    }
  }, [isAuthenticated, userRole, router])

  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium">Verificando permisos...</h2>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido, {userName}. Selecciona una opción para continuar.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Sistema de Gestión
            </CardTitle>
            <CardDescription>Accede al panel de administración y dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestiona pedidos, visualiza métricas y administra el sistema completo.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/app?mode=admin")}>
              Acceder al Sistema
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Administrar Usuarios
            </CardTitle>
            <CardDescription>Gestiona los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Añade, edita o elimina usuarios y asigna roles de acceso.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/admin/users")}>
              Gestionar Usuarios
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PackageOpen className="mr-2 h-5 w-5" />
              Preparación de Pedidos
            </CardTitle>
            <CardDescription>Accede al módulo de preparación</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualiza la interfaz de preparación de pedidos como lo verían los preparadores.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/app?mode=picker")}>
              Ver Preparación
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
