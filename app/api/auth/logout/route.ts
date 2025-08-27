import { NextResponse } from "next/server"

export async function POST() {
  // Since we're using JWT tokens, logout is primarily handled on the client side
  // by removing the token from storage. This endpoint exists for consistency
  // and could be extended to implement token blacklisting if needed.

  return NextResponse.json({ message: "Logout successful" }, { status: 200 })
}
