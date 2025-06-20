"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { PenTool, Home, User, LogIn, LogOut } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  console.log(user)

  return (
    <div className="min-h-screen bg-stone font-lora text-anthracite">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-sage/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-sage" />
              <span className="font-playfair text-2xl font-bold text-anthracite">BlogCraft</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className={`${
                    isActive("/")
                      ? "bg-sage text-white hover:bg-sage/90"
                      : "text-anthracite hover:text-sage hover:bg-sage/10"
                  }`}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-anthracite/70">Welcome, {user.username}</span>
                  <Button variant="ghost" onClick={logout} className="text-anthracite hover:text-sage hover:bg-sage/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button
                      variant={isActive("/login") ? "default" : "ghost"}
                      className={`${
                        isActive("/login")
                          ? "bg-sage text-white hover:bg-sage/90"
                          : "text-anthracite hover:text-sage hover:bg-sage/10"
                      }`}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant={isActive("/register") ? "default" : "ghost"}
                      className={`${
                        isActive("/register")
                          ? "bg-sage text-white hover:bg-sage/90"
                          : "text-anthracite hover:text-sage hover:bg-sage/10"
                      }`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-white/50 border-t border-sage/20 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-anthracite/60 text-sm">© 2024 BlogCraft. Crafted with ❤️ for writers and readers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
