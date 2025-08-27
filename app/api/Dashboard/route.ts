import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { findUserById } from "@/lib/db/users"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }

    const user = await findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
