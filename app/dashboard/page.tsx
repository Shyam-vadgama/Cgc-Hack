"use client"

import { useAuth } from "@/hooks/use-auth"
import { UserNav } from "@/components/auth/user-nav"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, KeyRound, UserCog, Settings } from "lucide-react"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be logged in to view this page.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserNav />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user.name} 👋
            </h2>
            <p className="text-muted-foreground">
              You're successfully authenticated and can manage your account.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Member since:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {user.role || "Standard User"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full flex items-center gap-2">
                  <Link href="/profile">
                    <UserCog size={18} /> Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full flex items-center gap-2">
                  <Link href="/settings">
                    <Settings size={18} /> Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Secure your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full flex items-center gap-2">
                  <Link href="/change-password">
                    <KeyRound size={18} /> Change Password
                  </Link>
                </Button>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
