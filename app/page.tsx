"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { ArrowRight, Clipboard, Package } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Portal OS</h1>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Bienvenido al <span className="text-primary">Portal OS</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Seleccione una opción para continuar con el sistema de gestión de pedidos y preparación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="w-full">
                  <Button className="w-full group" size="lg">
                    Gestionar Pedidos
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/portal?app=preparacion" className="w-full">
                  <Button className="w-full" variant="outline" size="lg">
                    Realizar Picking
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Características del Portal</CardTitle>
                  <CardDescription>Acceda a todas las herramientas de gestión desde un solo lugar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Visualice métricas y estadísticas en tiempo real</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clipboard className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Administración</h3>
                      <p className="text-sm text-muted-foreground">Gestione usuarios, productos y configuraciones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Preparación</h3>
                      <p className="text-sm text-muted-foreground">Organice y prepare pedidos de manera eficiente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
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
