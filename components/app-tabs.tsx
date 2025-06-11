"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AppTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: any
  isDirectAccess?: boolean
}

export function AppTabs({ activeTab, setActiveTab, user, isDirectAccess = false }: AppTabsProps) {
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

  // Si es acceso directo, solo mostrar la pestaña de preparación sin tabs
  if (isDirectAccess) {
    return (
      <div className="h-[calc(100vh-57px)] w-full">
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
            src="https://script.google.com/macros/s/AKfycbyS-U2gfG6pZ4QUME7jG_0HrNsfgGqmly4f84Zfj0xA98e-dtgg3uwW1Pa6dIV3cpfj/exec"
            className="w-full h-full border-0"
            title="Preparación"
            onLoad={() => handleIframeLoad("preparacion")}
            onError={() => handleIframeError("preparacion")}
          />
        </div>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} className="w-full h-[calc(100vh-57px)]">
      {/* Solo mostrar pestañas si el usuario es ADMIN */}
      {user?.role === "ADMIN" && (
        <div className="border-b px-4">
          <TabsList className="my-2">
            <TabsTrigger value="dashboard" onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="administracion" onClick={() => setActiveTab("administracion")}>
              Administración
            </TabsTrigger>
            <TabsTrigger value="preparacion" onClick={() => setActiveTab("preparacion")}>
              Preparación
            </TabsTrigger>
          </TabsList>
        </div>
      )}

      {user?.role === "ADMIN" && (
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
                src="https://script.google.com/macros/s/AKfycbzv5cQUmLRCFuMqUYWqh5MsZ1Jr4OyxKs5zRv_bTty2Z4-eQOKsKOY7D1cGBOTiVnBq/exec"
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
            src="https://script.google.com/macros/s/AKfycbyS-U2gfG6pZ4QUME7jG_0HrNsfgGqmly4f84Zfj0xA98e-dtgg3uwW1Pa6dIV3cpfj/exec"
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
