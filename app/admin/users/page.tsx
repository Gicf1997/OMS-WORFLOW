"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { addUser, getUsers, updateUser, deleteUser } from "@/lib/user-service"

interface User {
  name: string
  username: string
  role: string
}

export default function UsersAdminPage() {
  const router = useRouter()
  const { isAuthenticated, userRole } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Formulario para añadir usuario
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "picker",
  })

  // Usuario a editar
  const [editUser, setEditUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
  })

  // Usuario a eliminar
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (userRole !== "admin") {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta sección",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // Cargar usuarios
    loadUsers()
  }, [isAuthenticated, userRole, router])

  // Cargar lista de usuarios
  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await getUsers()
      if (result.success) {
        setUsers(result.users)
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudieron cargar los usuarios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Manejar envío del formulario para añadir usuario
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.name || !newUser.username || !newUser.password || !newUser.role) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await addUser(newUser.name, newUser.username, newUser.password, newUser.role)

      if (result.success) {
        toast({
          title: "Usuario añadido",
          description: "El usuario se ha añadido correctamente",
        })
        setAddDialogOpen(false)
        setNewUser({
          name: "",
          username: "",
          password: "",
          role: "picker",
        })
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo añadir el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Preparar usuario para editar
  const prepareEditUser = (user: User) => {
    setEditUser({
      name: user.name,
      username: user.username,
      password: "", // No enviamos la contraseña actual por seguridad
      role: user.role,
    })
    setEditDialogOpen(true)
  }

  // Manejar envío del formulario para editar usuario
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editUser.name || !editUser.username || !editUser.role) {
      toast({
        title: "Error",
        description: "Nombre, usuario y rol son obligatorios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await updateUser(
        editUser.username,
        editUser.name,
        editUser.password, // Si está vacío, no se actualizará la contraseña
        editUser.role,
      )

      if (result.success) {
        toast({
          title: "Usuario actualizado",
          description: "El usuario se ha actualizado correctamente",
        })
        setEditDialogOpen(false)
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo actualizar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Preparar usuario para eliminar
  const prepareDeleteUser = (username: string) => {
    setUserToDelete(username)
    setDeleteDialogOpen(true)
  }

  // Manejar eliminación de usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setLoading(true)
    try {
      const result = await deleteUser(userToDelete)

      if (result.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario se ha eliminado correctamente",
        })
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo eliminar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Administración de Usuarios</h1>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
              <DialogDescription>Completa el formulario para añadir un nuevo usuario al sistema.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    disabled={loading}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="picker">Preparador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Usuario"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>Gestiona los usuarios que pueden acceder al sistema de gestión de pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role === "admin" ? "Administrador" : "Preparador"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => prepareEditUser(user)}
                            title="Editar usuario"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => prepareDeleteUser(user.username)}
                            title="Eliminar usuario"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición de usuario */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Actualiza la información del usuario.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input
                  id="edit-name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-username">Nombre de usuario</Label>
                <Input
                  id="edit-username"
                  value={editUser.username}
                  disabled={true} // No permitimos cambiar el nombre de usuario
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-password">
                  Nueva contraseña{" "}
                  <span className="text-muted-foreground text-xs">(Dejar en blanco para no cambiar)</span>
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="picker">Preparador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Usuario"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
