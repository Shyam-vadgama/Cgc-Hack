import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db/users"
import { verifyPassword, validateEmail, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const user = await findUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      name: user.name,
    })

    // ✅ Cookie me token set karte hai
    const response = NextResponse.json(
      { message: "Login successful", user: { id: user._id, email: user.email, name: user.name } },
      { status: 200 }
    )
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
