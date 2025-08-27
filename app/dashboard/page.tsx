"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check token from localStorage
    const token = localStorage.getItem("token")

    if (!token) {
      router.replace("/login") // Agar token nahi hai to login pe bhej
    } else {
      // Yaha tu API call karke user data nikal sakta hai
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            localStorage.removeItem("token")
            router.replace("/login")
          } else {
            setUser(data)
          }
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem("token")
          router.replace("/login")
        })
    }
  }, [router])

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to Dashboard 🚀</h1>
      {user && <p className="mt-2">Logged in as {user.email}</p>}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token")
          router.replace("/login")
        }}
      >
        Logout
      </button>
    </div>
  )
}
