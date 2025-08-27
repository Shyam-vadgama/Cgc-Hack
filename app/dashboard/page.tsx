"use client"

import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard", { method: "GET" })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        setData({ error: "Unauthorized" })
      }
    }
    fetchData()
  }, [])

  if (!data) return <p>Loading...</p>
  if (data.error) return <p className="text-red-500">{data.error}</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {data.user.name}</h1>
      <h2 className="mt-4 text-xl">Courses:</h2>
      <ul className="list-disc ml-6">
        {data.data.courses.map((c: string) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  )
}
