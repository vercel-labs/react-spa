import { useState } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "../lib/constants"
import { HeartIcon, HeartIconSolid } from "./icons"

async function likePost(postId, likedByUser) {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likedByUser }),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    return data.likes
  } catch (error) {
    console.error("Error liking post:", error)
    throw new Error("Failed to like post")
  }
}
function Likes({
  postId,
  likes: initialLikes,
  likedByUser: initialLikedByUser,
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [likedByUser, setLikedByUser] = useState(initialLikedByUser)

  const handleLike = async () => {
    const newLikes = likedByUser ? likes - 1 : likes + 1
    const newLikedByUser = !likedByUser

    // Optimistically update the post's likes
    setLikes(newLikes)
    setLikedByUser(newLikedByUser)

    try {
      // Perform the actual operation on the server
      const validatedLikes = await likePost(postId, newLikedByUser)
      // Update the state with the actual likes count from the server
      setLikes(validatedLikes)
    } catch (error) {
      // Rollback the optimistic update
      console.error("Error updating likes:", error)
      setLikes(initialLikes)
      setLikedByUser(initialLikedByUser)
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-gray-500 text-sm"
    >
      {likedByUser ? (
        <HeartIconSolid className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5" strokeWidth={2} />
      )}
      {likes}
    </button>
  )
}

export function Post({ id, text, likes, username, name, image, likedByUser }) {
  return (
    <section className="p-6 text-gray-800 border-t flex gap-2">
      <Link to={`/${username}`} className="shrink-0">
        <img
          src={image}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
      </Link>
      <div>
        <div className="flex items-center gap-2">
          <Link
            to={`/${username}`}
            className="font-semibold hover:underline hover:underline-offset-2 transition-colors duration-200 ease-in-out"
          >
            {name}
          </Link>
          <Link to={`/${username}`} className="text-gray-500">
            @{username}
          </Link>
        </div>
        <p className="mt-2">{text}</p>
        <div className="mt-3">
          <Likes likes={likes} postId={id} likedByUser={likedByUser} />
        </div>
      </div>
    </section>
  )
}
