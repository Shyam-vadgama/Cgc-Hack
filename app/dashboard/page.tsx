"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.replace("/login")
    } else {
      fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            localStorage.removeItem("token")
            router.replace("/login")
          } else {
            setUser(res.user)
            setData(res.data)
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

      {data && (
        <div className="mt-4 text-center">
          <h2 className="font-semibold">Courses:</h2>
          <ul>
            {data.courses.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          <h2 className="font-semibold mt-2">Notifications:</h2>
          <ul>
            {data.notifications.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

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
