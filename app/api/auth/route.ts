import { NextResponse } from "next/server"

// Esta es una simulación de la autenticación para desarrollo local
// En producción, se usará la función GAS
const users = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "user", password: "user123", role: "USER" },
]

// Función simple para simular el hash SHA-256 en desarrollo
// (En producción se usa la función real de GAS)
function mockHash(password: string) {
  return password // En desarrollo, no aplicamos hash
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Buscar el usuario
    const user = users.find((u) => u.username === username && mockHash(u.password) === mockHash(password))

    if (user) {
      return NextResponse.json({
        success: true,
        role: user.role,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Credenciales inválidas",
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error en el servidor",
      },
      { status: 500 },
    )
  }
}
