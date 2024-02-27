require("dotenv").config()

const express = require("express")
const knex = require("knex")
const knexConfig = require("../../knexfile").development
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
const db = knex(knexConfig)
const router = express.Router()
const PORT = process.env.PORT || 5001
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(express.json())
app.use("/api", router)

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null)
    return res.status(401).json({ error: "Invalid credentials" })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid credentials" })
    req.user = user
    next()
  })
}

router.post("/verifyToken", authenticateToken, (req, res) => {
  res.status(200).json({ valid: true })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await db("users").where({ username }).first()

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    })
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Login failed" })
  }
})

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
        // Postgres returns lowercase aliases
        db.raw(
          'CASE WHEN likes.id IS NOT NULL THEN TRUE ELSE FALSE END AS "likedByUser"',
        ),
      )
      .orderBy("posts.id", "asc")

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
router.post("/posts/:postId/like", authenticateToken, async (req, res) => {
  const { postId } = req.params
  const { likedByUser } = req.body
  const { userId } = req.user

  try {
    await db.transaction(async (trx) => {
      const likeExists = await trx("likes").where({ userId, postId }).first()

      if (likedByUser && !likeExists) {
        await trx("likes").insert({ userId, postId })
        await trx("posts").where({ id: postId }).increment("likes", 1)
      } else if (!likedByUser && likeExists) {
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
