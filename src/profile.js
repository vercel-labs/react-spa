import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Post } from "./components/post"
import { API_URL } from "./lib/constants"

export default function Profile() {
  const { username } = useParams()
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // discuss why fetching data in a useEffect is not good practice
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `${API_URL}/posts?username=${username}`,
        )
        setUserPosts(response.data)
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
      {userPosts.map((post) => (
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
