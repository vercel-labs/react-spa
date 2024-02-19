import { useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import useSWR from "swr"
import { API_URL } from "../lib/constants"
import { fetcher } from "../lib/fetcher"
import { Modal } from "./modal"

export default function ProfileLayout() {
  const [show, setShow] = useState(false)
  const { username } = useParams()
  const { data: user, error } = useSWR(`${API_URL}/users/${username}`, fetcher)

  if (error) return <div>An error has occurred.</div>
  if (!user) return <div>Loading...</div>

  return (
    <div>
      <div>
        <div className="h-44 bg-blue-300"></div>
        <div className="mt-[-72px] px-6">
          <button
            onClick={() => setShow((current) => !current)}
            className="bg-transparent border-none rounded-full"
          >
            <img
              src={user.image}
              alt={`${user.name}'s avatar`}
              className="h-36 w-36 rounded-full outline outline-[5px] outline-white"
            />
          </button>
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
      <Modal close={() => setShow(false)} show={show}>
        <img
          src={user.image}
          alt={`${user.name}'s avatar`}
          className="outline outline-[5px] outline-white rounded-full"
        />
      </Modal>
    </div>
  )
}
