import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { findUserById } from "@/lib/db/users"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    // ✅ Token verify
    const decoded = await verifyToken(token).catch(() => null)
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      )
    }

    console.log("Decoded JWT:", decoded)

    // ✅ DB se user fetch
    const user = await findUserById(decoded.userId || decoded.id)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
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
  } catch (error: any) {
    console.error("Dashboard API error:", error.message || error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
