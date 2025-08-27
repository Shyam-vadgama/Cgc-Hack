// app/api/dashboard/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  // yaha tu DB se user data fetch kar sakta hai
  return NextResponse.json({
    message: "Dashboard data fetched successfully",
    data: {
      courses: ["React", "Next.js", "Tailwind"],
      notifications: ["Welcome to dashboard!", "New course available"],
    },
  })
}
