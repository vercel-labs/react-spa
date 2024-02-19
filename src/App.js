import React from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"
import RootLayout from "./components/root-layout"
import ProfileLayout from "./components/profile-layout"
import Feed from "./feed"
import Login from "./login"
import Profile from "./profile"
import { AuthProvider, useAuth } from "./lib/authContext"

function ProtectedRoutes() {
  const { isAuth, isLoading } = useAuth()
  if (isLoading) return null
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicRoutes() {
  const { isAuth, isLoading } = useAuth()
  if (isLoading) return null
  return isAuth ? <Navigate to="/" replace /> : <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Feed />} />
              <Route path="/:username" element={<ProfileLayout />}>
                <Route index element={<Profile />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
