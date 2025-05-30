const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const notifyUserInteraction = require("./notifyUser");

async function addComment({ postId, userId, content }) {
  const post = await Post.findById(postId).populate("author", "_id");
  const newComment = await Comment.create({
    post: postId,
    user: userId,
    content,
  });

  // Notifica o autor se o comentário for de outra pessoa
  if (post?.author?._id?.toString() !== userId) {
    const user = await User.findById(userId);
    await notifyUserInteraction({
      toUserId: post.author._id,
      fromUserId: userId,
      fromUserName: user.nome,
      type: "comment",
      postId,
    });
  }

  return newComment;
}

async function getComments(postId) {
  return await Comment.find({ post: postId })
    .populate("user", "nome ")
    .sort({ createdAt: -1 });
}

module.exports = {
  addComment,
  getComments,
};
