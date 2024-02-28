import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import { API_URL } from "../lib/constants"
import { Modal } from "./modal"

export default function ProfileLayout() {
  const { username } = useParams()
  const [show, setShow] = useState(false)
  const [user, setUser] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // discuss why fetching data in useEffect is not good practice
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${API_URL}/users/${username}`)
        setUser(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [username])

  if (error) return <div className="p-6">Failed to load</div>
  if (isLoading) return <div className="p-6">Loading...</div>

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
