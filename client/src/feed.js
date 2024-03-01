import axios from "axios"
import { useEffect, useState } from "react"
import { Post } from "./components/post"
import { API_URL } from "./lib/constants"
import { useAuth } from "./lib/authContext"

export default function Feed() {
  const { userId } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // discuss why fetching data in useEffect is not good practice
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${API_URL}/posts`, {
          params: { userId },
        })
        setPosts(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [userId])

  if (error) return <div className="p-6">Failed to load</div>
  if (isLoading) return <div className="p-6">Loading...</div>

  return (
    <div>
      {posts.map((post) => (
        <Post
          id={post.id}
          text={post.text}
          likes={post.likes}
          likedByUser={post.likedByUser}
          username={post.username}
          name={post.name}
          image={post.image}
          key={post.id}
        />
      ))}
    </div>
  )
}
