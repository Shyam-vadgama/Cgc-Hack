// app/api/dashboard/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"  // JWT verify karne wala function
import { findUserById } from "@/lib/db/users" // DB se user data nikalne wala

export async function GET(req: NextRequest) {
  try {
    // 1. Header se token nikal
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    // 2. Token verify
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      )
    }

    // 3. DB se user fetch
    const user = await findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // 4. User-specific dashboard data
    return NextResponse.json({
      message: "Dashboard data fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      data: {
        courses: ["React", "Next.js", "Tailwind"],
        notifications: [
          `Welcome back, ${user.name}!`,
          "New course available",
        ],
      },
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
