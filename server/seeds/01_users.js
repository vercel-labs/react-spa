const bcrypt = require("bcrypt")

exports.seed = async function (knex) {
  await knex("users").del()

  const hashedPassword = await bcrypt.hash("123456", 10)

  await knex("users").insert([
    {
      id: 1,
      username: "john_doe",
      password: hashedPassword,
      name: "John Doe",
      bio: "Coding enthusiast. I turn coffee into code.",
      image: "images/john_doe.jpg",
    },
    {
      id: 2,
      username: "jane_smith",
      password: hashedPassword,
      name: "Jane Smith",
      bio: "Creating products that matter. Passionate about UX.",
      image: "images/jane_smith.jpg",
    },
    {
      id: 3,
      username: "alex_morales",
      password: hashedPassword,
      name: "Alex Morales",
      bio: "Part-time artist, full-time dreamer. Let's make the internet a better place.",
      image: "images/alex_morales.jpg",
    },
  ])
}
