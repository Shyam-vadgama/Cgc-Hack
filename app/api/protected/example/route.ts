import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/middleware/auth"

// Example of a protected API route using the auth middleware
async function handler(request: AuthenticatedRequest) {
  // The user is guaranteed to be authenticated here
  const user = request.user!

  return NextResponse.json({
    message: "This is a protected route",
    user: {
      userId: user.userId,
      email: user.email,
      name: user.name,
    },
  })
}

export const GET = requireAuth(handler)
export const POST = requireAuth(handler)
