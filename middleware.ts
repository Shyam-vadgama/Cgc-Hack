import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // 🔒 Protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // ✅ If logged in and trying to access login → send to dashboard
  if (pathname.startsWith("/login") && token) {
    try {
      const decoded = verifyToken(token)
      if (decoded) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
