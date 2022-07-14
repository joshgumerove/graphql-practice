const users = [
  {
    id: "1",
    name: "Josh Gumerove",
    email: "josh.gumerove@example.com",
    age: 31,
  },
  {
    id: "2",
    name: "Brennan Gumerove",
    email: "brennan@example.com",
    age: 35,
  },
  {
    id: "3",
    name: "Barry Gumerove",
    email: "barry.example.com",
    age: 60,
  },
];

const posts = [
  {
    id: "1",
    title: "I Love GraphQL",
    body: "GraphQL is really really great and I love Antarctica",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "I Love Programming",
    body: "Sometimes programming can be difficult",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "I Like to Travel",
    body: "I want to go to antarctica",
    published: true,
    author: "3",
  },
];

const comments = [
  {
    id: "11",
    text: "look at all the monkeys at the zoo",
    author: "3",
    post: "1",
  },

  {
    id: "12",
    text: "I am learning graphQL",
    author: "1",
    post: "1",
  },

  {
    id: "13",
    text: "The best is yet to come?",
    author: "1",
    post: "2",
  },

  {
    id: "14",
    text: "Charlie Sheen is winning!!!",
    author: "2",
    post: "3",
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
