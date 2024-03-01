exports.seed = async function (knex) {
  await knex("posts").del()
  await knex("posts").insert([
    {
      id: 1,
      userId: 1,
      text: "Exploring the new React features has been an absolute joy! The latest hooks are a game changer for functional components.",
      likes: 150,
    },
    {
      id: 2,
      userId: 2,
      text: "Here are some of my top product management tips for those just starting out in the field. Always prioritize user feedback!",
      likes: 90,
    },
    {
      id: 3,
      userId: 3,
      text: "A great UX is more than just good looks; it's about creating accessible, intuitive interfaces that everyone can navigate and enjoy.",
      likes: 180,
    },
    {
      id: 4,
      userId: 1,
      text: "Here are some JavaScript tips for beginners: don't underestimate the power of understanding the core concepts before diving into frameworks.",
      likes: 95,
    },
    {
      id: 5,
      userId: 2,
      text: "What makes a product truly great? It's not just about solving a problem but doing so in a way that's seamless, intuitive, and even delightful for the user.",
      likes: 110,
    },
    {
      id: 6,
      userId: 3,
      text: "Inclusive design goes beyond accessibility standards. It's about considering the full range of human diversity with respect to ability, language, culture, gender, age, and other forms of human difference.",
      likes: 250,
    },
    {
      id: 7,
      userId: 1,
      text: "Debugging is an art as much as a science. Here are some tips: always start by understanding the problem fully, then isolate the issue, and remember, console.logs are your friend... but so are debugger tools.",
      likes: 65,
    },
  ])
}
