const express = require("express")
const knex = require("knex")
const cors = require("cors")
const knexConfig = require("../../knexfile").development

const app = express()
const db = knex(knexConfig)
const router = express.Router()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())
app.use("/api", router)

router.get("/users/:username", async (req, res) => {
  const { username } = req.params

  try {
    const user = await db("users").where({ username }).first()

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/posts", async (req, res) => {
  try {
    const userId = 1 // Hardcoded until we add authentication

    let query = db("posts")
      .join("users", "posts.userId", "=", "users.id")
      .leftJoin("likes", function () {
        this.on("likes.postId", "=", "posts.id").andOnVal(
          "likes.userId",
          "=",
          userId,
        )
      })
      .select(
        "posts.id",
        "posts.text",
        "posts.likes",
        "users.username",
        "users.name",
        "users.image",
        db.raw(
          "CASE WHEN likes.id IS NOT NULL THEN TRUE ELSE FALSE END AS likedByUser",
        ),
      )

    if (req.query.username) {
      query = query.where("users.username", req.query.username)
    }

    const posts = await query

    if (posts.length > 0) {
      res.json(
        posts.map((post) => ({
          ...post,
          // Convert 0/1 to boolean
          likedByUser: Boolean(post.likedByUser),
        })),
      )
    } else {
      res.status(404).json({ message: "No posts found" })
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/posts/:postId/like", async (req, res) => {
  const userId = 1 // Hardcoded until we add authentication

  const postId = req.params.postId
  const { action } = req.body

  try {
    await db.transaction(async (trx) => {
      const likeExists = await trx("likes").where({ userId, postId }).first()

      if (action === "like" && !likeExists) {
        await trx("likes").insert({ userId, postId })
        await trx("posts").where({ id: postId }).increment("likes", 1)
      } else if (action === "unlike" && likeExists) {
        await trx("likes").where({ userId, postId }).delete()
        await trx("posts").where({ id: postId }).decrement("likes", 1)
      }

      // Get the updated likes count to return to the client
      const updatedPost = await trx("posts")
        .where({ id: postId })
        .select("likes")
        .first()

      res.json({ postId, likes: updatedPost.likes })
    })
  } catch (error) {
    console.error("Error processing like action", error)
    res.status(500).send("Error processing like action")
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
