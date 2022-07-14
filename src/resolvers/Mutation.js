import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("email already in use");
    } else {
      // the below is clearer than my original solution
      const user = {
        id: uuidv4(),
        ...args.data,
      };
      db.users.push(user);
      return user;
    }
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    if (userExists) {
      const post = {
        id: uuidv4(),
        ...args.data,
      };
      db.posts.push(post);
      if (post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
      return post;
    } else {
      throw new Error("Author ID does not exists");
    }
  },

  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };
    if (!post) {
      throw new Error("Post not found");
    }
    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
      if (originalPost.published && !post.published) {
        //deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else if (post.published) {
        //updated;
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    }
    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const authorExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (authorExists && postExists) {
      const comment = {
        id: uuidv4(),
        ...args.data,
      };
      db.comments.push(comment);
      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: "CREATED",
          data: comment,
        },
      });
      return comment;
    } else {
      throw new Error("Invalid Post or Author ID");
    }
  },

  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => (comment.id = id));
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: "UPDATED",
          data: comment,
        },
      });
    }

    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email already in use");
      }
      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }
    return user;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== args.id);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }
    return post;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    console.log(args);
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const deletedComments = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComments[0].post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComments[0],
      },
    });
    return deletedComments[0];
  },
};

export { Mutation as default };
