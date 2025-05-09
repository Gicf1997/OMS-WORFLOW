"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { verifyCredentials } from "@/lib/auth-service"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  userName: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("oms-auth")
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        setIsAuthenticated(true)
        setUserRole(authData.role)
        setUserName(authData.name)
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem("oms-auth")
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await verifyCredentials(username, password)

      if (result.success) {
        setIsAuthenticated(true)
        setUserRole(result.role)
        setUserName(result.name)

        // Store auth data in localStorage
        localStorage.setItem(
          "oms-auth",
          JSON.stringify({
            username,
            role: result.role,
            name: result.name,
          }),
        )

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserName(null)
    localStorage.removeItem("oms-auth")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
