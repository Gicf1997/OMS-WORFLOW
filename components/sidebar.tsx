"use client"

import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  user: any
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

export function Sidebar({ isOpen, setIsOpen, user, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Evitar renderizado en el servidor
  if (!isMounted) {
    return null
  }

  // En móviles, usar Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent
            user={user}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab)
              setIsOpen(false)
            }}
            onLogout={onLogout}
          />
        </SheetContent>
      </Sheet>
    )
  }

  // En desktop, usar sidebar normal
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: isOpen ? 240 : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
      className={cn("border-r bg-card h-[calc(100vh-57px)] overflow-hidden", isOpen ? "w-60" : "w-0")}
    >
      {isOpen && <SidebarContent user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />}
    </motion.div>
  )
}

function SidebarContent({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}: {
  user: any
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* User info */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium truncate">{user?.name || user?.username || "Usuario"}</p>
            <p className="text-xs text-muted-foreground">{user?.role === "ADMIN" ? "Administrador" : "Usuario"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">APLICACIONES</h3>
          {/* Solo mostrar todas las opciones si el usuario es ADMIN */}
          {user?.role === "ADMIN" ? (
            <>
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === "administracion" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("administracion")}
              >
                Administración
              </Button>
              <Button
                variant={activeTab === "preparacion" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("preparacion")}
              >
                Preparación
              </Button>
            </>
          ) : (
            // Si no es ADMIN, solo mostrar Preparación
            <Button
              variant={activeTab === "preparacion" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("preparacion")}
            >
              Preparación
            </Button>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <Button variant="outline" className="w-full" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
