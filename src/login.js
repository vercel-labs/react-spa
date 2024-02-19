import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./lib/authContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate("/")
    } catch (error) {
      setError("Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="max-w-md mx-auto my-10 p-8 border rounded-lg">
      <h2 className="text-2xl font-semibold">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
        <div className="border text-gray-400 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="border text-gray-400 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-bold rounded-3xl hover:bg-opacity-80 outline-offset-2"
        >
          Log in
        </button>
      </form>
      {error && <p className="error text-red-500 text-sm my-2">{error}</p>}
    </div>
  )
}
