const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User"); // Importação necessária
const notifyUserInteraction = require("./notifyUser"); // Importação necessária

async function addComment({ userId, postId, content }) {
  const comment = await Comment.create({ user: userId, post: postId, content });

  const post = await Post.findById(postId).populate("author");

  if (post?.author?._id?.toString() !== userId) {
    const user = await User.findById(userId);
    if (user && post.author) {
      await notifyUserInteraction({
        toUserId: post.author._id,
        fromUserName: user.nome,
        type: "comment",
        postId,
      });
    }
  }

  return comment;
}

module.exports = {
  addComment,
};
