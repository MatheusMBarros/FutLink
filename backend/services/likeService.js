const Like = require("../models/Like");
const Post = require("../models/Post");
const notifyUserInteraction = require("./notifyUser");
const User = require("../models/User"); // <- ESSENCIAL

async function toggleLike(postId, userId) {
  const existingLike = await Like.findOneAndDelete({
    user: userId,
    post: postId,
  });


  if (existingLike) {
    return { liked: false };
  }

  await Like.create({ user: userId, post: postId });

  const post = await Post.findById(postId).populate("author");
  if (post?.author?._id?.toString() !== userId) {
    const user = await User.findById(userId);
    if (user && post.author) {
      await notifyUserInteraction({
        toUserId: post.author._id,
        fromUserName: user.nome,
        type: "like",
        postId,
      });
    }
  }

  return { liked: true };
}

module.exports = {
  toggleLike,
};
