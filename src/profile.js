import React from "react"
import { useParams } from "react-router-dom"
import { fetcher } from "./lib/fetcher"
import useSWR from "swr"
import { Post } from "./components/post"
import { API_URL } from "./lib/constants"

export default function Profile() {
  const { username } = useParams()
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR(`${API_URL}/posts?username=${username}`, fetcher)

  if (error) return <div>An error has occurred.</div>
  if (isLoading) return <div>Loading...</div>

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
