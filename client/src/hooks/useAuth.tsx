"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types/blog"
import { blogApi } from "../lib/api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  checkingAuth: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true)
      const response = await blogApi.checkAuth()
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setCheckingAuth(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await blogApi.login({ email, password })
      await checkAuthStatus()
      console.log(response)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await blogApi.register({ username, email, password })
      await checkAuthStatus()
      console.log(response)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await blogApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading, checkingAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
