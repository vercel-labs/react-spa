import { Link } from "react-router-dom"
import { HeartIcon } from "./icons"
import { useSWRConfig } from "swr"
import { API_URL } from "../lib/constants"

function Likes({ postId, likes, likedByUser }) {
  const { mutate } = useSWRConfig()

  const handleLike = async () => {
    const action = likedByUser ? "unlike" : "like"
    const newLikes = action === "like" ? likes + 1 : likes - 1

    // Optimistically update the post's likes in the feed
    mutate(
      `${API_URL}/posts`,
      (posts) => {
        return posts.map((post) => {
          if (post.id === postId) {
            return { ...post, likes: newLikes, likedByUser: !likedByUser }
          }
          return post
        })
      },
      false,
    )

    try {
      // Perform the actual like/unlike operation on the server
      await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      // Revalidate
      mutate(`${API_URL}/posts`)
    } catch (error) {
      console.error("Error updating likes:", error)
      // Optionally handle errors, such as rolling back optimistic updates, if necessary

      // Rollback the optimistic update
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-gray-500 text-sm"
    >
      <HeartIcon
        className={`h-5 w-5 ${likedByUser ? "text-red-500" : ""}`}
        strokeWidth={2}
      />
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
