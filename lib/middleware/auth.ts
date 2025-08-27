import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "../auth"
import { findUserById } from "../db/users"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    name: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get token from Authorization header
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
      }

      const token = authHeader.substring(7) // Remove "Bearer " prefix

      // Verify token
      const payload = verifyToken(token)
      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Verify user still exists
      const user = await findUserById(payload.userId)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 })
      }

      // Add user info to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      }

      return await handler(authenticatedRequest)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(handler)
}
