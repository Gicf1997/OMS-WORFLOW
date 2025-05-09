import { sha256 } from "./crypto-utils"

// Actualizar la URL de la API de autenticación
const AUTH_API_URL =
  "https://script.google.com/macros/s/AKfycbxDcySN9e36K7njXP7HvgaIY6q6jFlYrVQOUsyu85rE-qZueUY66XOfWqgIl4CBaf5wog/exec"

interface UserResult {
  success: boolean
  message?: string
  users?: Array<{
    name: string
    username: string
    role: string
  }>
}

/**
 * Obtiene la lista de todos los usuarios
 */
export async function getUsers(): Promise<UserResult> {
  try {
    const response = await fetch(`${AUTH_API_URL}?action=getUsers`)

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      message: "Error al obtener usuarios",
    }
  }
}

/**
 * Añade un nuevo usuario
 */
export async function addUser(name: string, username: string, password: string, role: string): Promise<UserResult> {
  try {
    // Generar hash de la contraseña
    const passwordHash = await sha256(password)

    // Construir URL con parámetros
    const url = `${AUTH_API_URL}?action=addUser&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&passwordHash=${encodeURIComponent(passwordHash)}&role=${encodeURIComponent(role)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding user:", error)
    return {
      success: false,
      message: "Error al añadir usuario",
    }
  }
}

/**
 * Actualiza un usuario existente
 */
export async function updateUser(
  username: string,
  name: string,
  password: string | null,
  role: string,
): Promise<UserResult> {
  try {
    // Construir URL base
    let url = `${AUTH_API_URL}?action=updateUser&username=${encodeURIComponent(username)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`

    // Añadir hash de contraseña solo si se proporciona una nueva
    if (password && password.trim() !== "") {
      const passwordHash = await sha256(password)
      url += `&passwordHash=${encodeURIComponent(passwordHash)}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      message: "Error al actualizar usuario",
    }
  }
}

/**
 * Elimina un usuario
 */
export async function deleteUser(username: string): Promise<UserResult> {
  try {
    const url = `${AUTH_API_URL}?action=deleteUser&username=${encodeURIComponent(username)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      message: "Error al eliminar usuario",
    }
  }
}
