// app/api/dashboard/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Token nikalna header se
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token missing" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Yaha tu apna dynamic data laa sakta hai, jaise DB se
    const dashboardData = {
      message: "Welcome to your dashboard!",
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
      },
      stats: {
        totalProjects: 5,
        completed: 3,
        ongoing: 2,
      },
      lastLogin: new Date().toISOString(),
    }

    return NextResponse.json(dashboardData, { status: 200 })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
