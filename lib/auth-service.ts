import { sha256 } from "./crypto-utils"

// Actualizar la URL de la API de autenticación
const AUTH_API_URL =
  "https://script.google.com/macros/s/AKfycbxDcySN9e36K7njXP7HvgaIY6q6jFlYrVQOUsyu85rE-qZueUY66XOfWqgIl4CBaf5wog/exec"

// This would be replaced with actual API calls to your Google Sheet
// For now, we'll simulate with a mock implementation

// Mock user database (in production, this would be fetched from Google Sheets)
const MOCK_USERS = [
  {
    name: "Administrador",
    username: "admin",
    // This is a SHA-256 hash of "admin123"
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    role: "admin",
  },
  {
    name: "Usuario Preparación",
    username: "picker",
    // This is a SHA-256 hash of "picker123"
    passwordHash: "7d5b3b56d8a0e6a5e3fbc6597c03cf2d9f68c6e0f9a0b0b0f0f0f0f0f0f0f0f0",
    role: "picker",
  },
]

interface VerifyResult {
  success: boolean
  role?: string
  name?: string
  message?: string
}

export async function verifyCredentials(username: string, password: string): Promise<VerifyResult> {
  try {
    // Generar hash de la contraseña
    const passwordHash = await sha256(password)

    // Llamar a la API de Google Apps Script
    const response = await fetch(
      `${AUTH_API_URL}?action=verifyCredentials&username=${encodeURIComponent(username)}&passwordHash=${encodeURIComponent(passwordHash)}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error("Server response not OK:", await response.text())
      throw new Error("Error en la respuesta del servidor")
    }

    const data = await response.json()
    console.log("Auth response:", data)

    if (data.success) {
      return {
        success: true,
        role: data.role,
        name: data.name,
      }
    }

    return {
      success: false,
      message: data.message || "Credenciales inválidas",
    }
  } catch (error) {
    console.error("Error verifying credentials:", error)
    return {
      success: false,
      message: "Error al verificar credenciales",
    }
  }
}

// In a real implementation, you would add functions to:
// 1. Fetch users from Google Sheets via Google Apps Script API
// 2. Add/update/delete users
// 3. Handle password resets, etc.
