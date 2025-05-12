"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AppTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: any
}

export function AppTabs({ activeTab, setActiveTab, user }: AppTabsProps) {
  const [iframeStates, setIframeStates] = useState({
    dashboard: { loading: true, error: false },
    administracion: { loading: true, error: false },
    preparacion: { loading: true, error: false },
  })

  const handleIframeLoad = (tab: string) => {
    setIframeStates((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], loading: false },
    }))
  }

  const handleIframeError = (tab: string) => {
    setIframeStates((prev) => ({
      ...prev,
      [tab]: { loading: false, error: true },
    }))
  }

  const retryLoading = (tab: string) => {
    setIframeStates((prev) => ({
      ...prev,
      [tab]: { loading: true, error: false },
    }))

    // Forzar recarga del iframe
    const iframe = document.getElementById(`iframe-${tab}`) as HTMLIFrameElement
    if (iframe) {
      const src = iframe.src
      iframe.src = ""
      setTimeout(() => {
        iframe.src = src
      }, 100)
    }
  }

  return (
    <Tabs value={activeTab} className="w-full h-[calc(100vh-57px)]">
      {(!user || user?.role === "ADMIN") && (
        <>
          <TabsContent
            value="dashboard"
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="relative w-full h-full">
              {iframeStates.dashboard.loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-center text-muted-foreground">Cargando Dashboard...</p>
                </div>
              )}

              {iframeStates.dashboard.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
                  <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="mb-2">
                      No se pudo cargar el Dashboard. Puede ser un problema de conexión o permisos.
                    </AlertDescription>
                    <Button size="sm" onClick={() => retryLoading("dashboard")}>
                      Reintentar
                    </Button>
                  </Alert>
                </div>
              )}

              <iframe
                id="iframe-dashboard"
                src="https://script.google.com/macros/s/AKfycbyj4h8m5_44SBNDpsMGcO4AJTNkpqO7cHRy_vnEYYcIU_DZHHT5IS4u5exMX8lOac75/exec"
                className="w-full h-full border-0"
                title="Dashboard"
                onLoad={() => handleIframeLoad("dashboard")}
                onError={() => handleIframeError("dashboard")}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="administracion"
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="relative w-full h-full">
              {iframeStates.administracion.loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-center text-muted-foreground">Cargando Administración...</p>
                </div>
              )}

              {iframeStates.administracion.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
                  <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="mb-2">
                      No se pudo cargar Administración. Puede ser un problema de conexión o permisos.
                    </AlertDescription>
                    <Button size="sm" onClick={() => retryLoading("administracion")}>
                      Reintentar
                    </Button>
                  </Alert>
                </div>
              )}

              <iframe
                id="iframe-administracion"
                src="https://script.google.com/macros/s/AKfycbyH9b_E-knT2OsbSqKcEoS5fLU4U54arQ8XRWUxA5Z9MRVIEI30nQjcB-sk4mZx8xAg/exec"
                className="w-full h-full border-0"
                title="Administración"
                onLoad={() => handleIframeLoad("administracion")}
                onError={() => handleIframeError("administracion")}
              />
            </div>
          </TabsContent>
        </>
      )}

      <TabsContent value="preparacion" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
        <div className="relative w-full h-full">
          {iframeStates.preparacion.loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-center text-muted-foreground">Cargando Preparación...</p>
            </div>
          )}

          {iframeStates.preparacion.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mb-2">
                  No se pudo cargar Preparación. Puede ser un problema de conexión o permisos.
                </AlertDescription>
                <Button size="sm" onClick={() => retryLoading("preparacion")}>
                  Reintentar
                </Button>
              </Alert>
            </div>
          )}

          <iframe
            id="iframe-preparacion"
            src="https://script.google.com/macros/s/AKfycbwLCEICqyo_W7iyS-SWaX9QpmS4jk73ebfFRfEiUjzPvl8WnKIL9m_X8x5Wdz3icJeX/exec"
            className="w-full h-full border-0"
            title="Preparación"
            onLoad={() => handleIframeLoad("preparacion")}
            onError={() => handleIframeError("preparacion")}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
