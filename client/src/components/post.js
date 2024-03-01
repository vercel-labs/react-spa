import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../lib/constants"
import { HeartIcon, HeartIconSolid } from "./icons"

async function likePost(postId, likedByUser) {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      { likedByUser },
      {
        withCredentials: true,
      },
    )
    return response.data.likes
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

    // 1. Optimistically update the post's likes
    setLikes(newLikes)
    setLikedByUser(newLikedByUser)

    try {
      // 2. Perform the actual operation on the server
      const validatedLikes = await likePost(postId, newLikedByUser)
      // 3. Update the state with the actual likes count from the server
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
  const ProfileLink = `/${username}`

  return (
    <section className="p-6 text-gray-800 border-t flex gap-2">
      <Link to={ProfileLink} className="shrink-0">
        <img
          src={image}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
      </Link>
      <div>
        <div className="flex items-center gap-2">
          <Link
            to={ProfileLink}
            className="font-semibold hover:underline hover:underline-offset-2 transition-colors duration-200 ease-in-out"
          >
            {name}
          </Link>
          <span className="text-gray-500">@{username}</span>{" "}
          {/* Changed to span for non-interactive username mention */}
        </div>
        <p className="mt-2">{text}</p>
        <div className="mt-3">
          <Likes likes={likes} postId={id} likedByUser={likedByUser} />
        </div>
      </div>
    </section>
  )
}
