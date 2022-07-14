const Query = {
  users(parent, args, { db }, info) {
    if (args.query) {
      return db.users.filter((user) =>
        user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
    } else {
      return db.users;
    }
  },
  posts(parent, args, { db }, info) {
    if (args.query) {
      return db.posts.filter((post) => {
        const isTitleMatch = post.title
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        const isBodyMatch = post.body
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    } else {
      return db.posts;
    }
  },

  comments(parent, args, { db }, info) {
    return db.comments;
  },

  me(parent, args, ctx, info) {
    return {
      id: "40",
      name: "Josh Gumerov",
      email: "jgummybear@example.com",
      age: 31,
    };
  },
  // end here
};

export { Query as default };
