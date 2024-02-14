import React from "react"
import useSWR from "swr"
import { fetcher } from "./lib/fetcher"
import { Post } from "./components/post"
import { API_URL } from "./lib/constants"

export default function Feed() {
  const { data: posts, error, isLoading } = useSWR(`${API_URL}/posts`, fetcher)

  if (error) return <div>Failed to load</div>
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
