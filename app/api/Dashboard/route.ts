// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "supersecret"

export async function GET(req: NextRequest) {
  try {
    // 1. Header se token lena
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1] // "Bearer <token>"
    if (!token) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    // 2. Token verify karna
    let decoded
    try {
      decoded = jwt.verify(token, SECRET)
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 })
    }

    // 3. Agar token sahi hai to user-specific data return karna
    return NextResponse.json({
      message: "Dashboard data fetched successfully ✅",
      user: decoded,
      data: {
        courses: ["React", "Next.js", "Tailwind"],
        notifications: [
          "Welcome to your dashboard 🚀",
          "You have a new message",
        ],
      },
    })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
