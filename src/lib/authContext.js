import React, { createContext, useContext, useState, useEffect } from "react"
import { API_URL } from "./constants"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check token on the server, don't trust the client
    const verifyToken = async () => {
      const token = localStorage.getItem("token")
      const username = localStorage.getItem("username")

      if (!token) {
        setIsAuth(false)
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/verifyToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          setIsAuth(true)
          setToken(token)
          setUsername(username)
        } else {
          logout()
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

  async function login(username, password) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const errorBody = await res.json()
        throw new Error(errorBody.error || "Failed to login")
      }

      const { token } = await res.json()
      localStorage.setItem("token", token)
      localStorage.setItem("username", username)
      setIsAuth(true)
      setToken(token)
      setUsername(username)
    } catch (error) {
      throw error
    }
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setIsAuth(false)
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, isLoading, token, username }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
