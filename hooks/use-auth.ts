"use client"

import { useAuth } from "@/contexts/auth-context"

export { useAuth }

// Additional auth-related hooks can be added here
export function useRequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return { user: null, loading: true, isAuthenticated: false }
  }

  return {
    user,
    loading: false,
    isAuthenticated: !!user,
  }
}
