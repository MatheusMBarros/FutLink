const Post = require("../models/Post");
const Like = require("../models/Like");

const createPost = async (data) => {
  const newPost = new Post(data);
  return await newPost.save();
};

const getAllPostsWithLikes = async (userId) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .lean();

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      const liked = userId
        ? !!(await Like.findOne({ post: post._id, user: userId }))
        : false;

      return {
        ...post,
        likes: likeCount,
        likedByCurrentUser: liked,
      };
    })
  );

  return enrichedPosts;
};

module.exports = {
  createPost,
  getAllPostsWithLikes,
};
