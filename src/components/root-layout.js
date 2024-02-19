import { NavLink, Outlet } from "react-router-dom"
import { HomeIcon, HomeIconSolid, UserIcon, UserIconSolid } from "./icons"
import { useAuth } from "../lib/authContext"

export default function RootLayout() {
  const { username } = useAuth()

  return (
    <div className="flex mx-auto max-w-6xl">
      <nav className="w-64 shrink-0 p-8 flex flex-col h-screen gap-5 text-xl top-0 sticky tracking-wider">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex gap-3 items-center ${isActive ? "font-bold" : ""}`
          }
        >
          {({ isActive }) => (
            <>{isActive ? <HomeIconSolid /> : <HomeIcon />} Home</>
          )}
        </NavLink>
        <NavLink
          to={`/${username}`}
          className={({ isActive }) =>
            `flex gap-3 items-center ${isActive ? "font-bold" : ""}`
          }
        >
          {({ isActive }) => (
            <>{isActive ? <UserIconSolid /> : <UserIcon />} Profile</>
          )}
        </NavLink>
      </nav>

      <main className="border-x min-h-screen">
        <Outlet />
      </main>

      <div className="w-64 shrink-0"></div>
    </div>
  )
}
