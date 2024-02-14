import { Outlet, NavLink, useParams } from "react-router-dom"
import { fetcher } from "../lib/fetcher"
import useSWR from "swr"
import { HomeIcon, HomeIconSolid, UserIcon, UserIconSolid } from "./icons"
import { API_URL } from "../lib/constants"

export function RootLayout() {
  // Hardcoded until we implement authentication
  const username = "john_doe"

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

export function ProfileLayout() {
  const { username } = useParams()
  const { data: user, error } = useSWR(`${API_URL}/users/${username}`, fetcher)

  if (error) return <div>An error has occurred.</div>
  if (!user) return <div>Loading...</div>

  return (
    <div>
      <div>
        <div className="h-44 bg-blue-300"></div>
        <div className="mt-[-72px] px-6">
          <img
            src={user.image}
            alt={`${user.name}'s avatar`}
            className="h-36 w-36 rounded-full outline outline-[5px] outline-white"
          />
          <div className="mt-4">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-md text-gray-700 mt-2">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
