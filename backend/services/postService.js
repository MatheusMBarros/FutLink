const Post = require("../models/Post");

const createPost = async (data) => {
  const newPost = new Post(data);
  return await newPost.save();
};

const getAllPosts = async () => {
  return await Post.find().sort({ createdAt: -1 }).populate("author", "nome");
};

module.exports = {
  createPost,
  getAllPosts,
};
