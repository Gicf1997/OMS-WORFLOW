import { sha256 } from "./crypto-utils"

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
    // In a real implementation, this would make an API call to a Google Apps Script
    // that reads from your Google Sheet

    // For demo purposes, we'll use the mock data
    const passwordHash = await sha256(password)
    const user = MOCK_USERS.find((u) => u.username === username && u.passwordHash === passwordHash)

    if (user) {
      return {
        success: true,
        role: user.role,
        name: user.name,
      }
    }

    return {
      success: false,
      message: "Credenciales inválidas",
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
