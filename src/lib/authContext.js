import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { API_URL } from "./constants"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState(null)

  // Check token on the server, don't trust the client
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/verifyToken`, {
          withCredentials: true,
        })

        if (response.status === 200) {
          setIsAuth(true)
          setUsername(response.data.username)
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
      const response = await axios.post(
        `${API_URL}/login`,
        {
          username,
          password,
        },
        { withCredentials: true },
      )

      setIsAuth(true)
      setUsername(response.data.username)
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
      setIsAuth(false)
      setUsername(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, isLoading, username }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
