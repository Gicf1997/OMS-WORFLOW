"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Obtener los parámetros de la URL
    const success = searchParams.get("success")
    const role = searchParams.get("role") || searchParams.get("rol")
    const error = searchParams.get("error") || searchParams.get("message")

    // Recuperar el nombre de usuario de sessionStorage
    const username = sessionStorage.getItem("pendingUsername")

    // Limpiar sessionStorage
    sessionStorage.removeItem("pendingUsername")

    if (success === "true" && role && username) {
      // Autenticación exitosa
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          role: role,
          isAuthenticated: true,
        }),
      )

      // Redirigir al portal
      router.push("/portal")
    } else {
      // Error de autenticación
      toast({
        title: "Error de autenticación",
        description: error || "Usuario o contraseña incorrectos",
        variant: "destructive",
      })

      // Redirigir al login
      router.push("/login")
    }
  }, [router, searchParams, toast])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Procesando autenticación</h2>
        <p className="text-gray-500">Por favor espere...</p>
      </div>
    </div>
  )
}
