"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [success, setSuccess] = useState("")

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      // get user info from token or API
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (e) {
        console.error(e)
      }
    }
    setLoading(false)
  }, [router])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Password updated successfully ✅")
        setNewPassword("")
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("Something went wrong")
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>

        {user ? (
          <>
            <p className="mb-2">Welcome, <span className="font-semibold">{user.name}</span></p>
            <p className="mb-4 text-gray-600">{user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mb-6"
            >
              Logout
            </button>

            <form onSubmit={handlePasswordReset}>
              <h2 className="text-lg font-semibold mb-2">Reset Password</h2>

              {error && <p className="text-red-500 mb-2">{error}</p>}
              {success && <p className="text-green-600 mb-2">{success}</p>}

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Update Password
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-600">No user found</p>
        )}
      </div>
    </div>
  )
}
