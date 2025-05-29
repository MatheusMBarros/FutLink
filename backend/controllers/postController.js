const postService = require("../services/postService");
const Post = require("../models/Post");
const Like = require("../models/Like");

exports.createPost = async (req, res) => {
  try {
    const { author, content, mediaUrl } = req.body;
    const savedPost = await postService.createPost({
      author,
      content,
      mediaUrl,
    });
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar post", details: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { userId } = req.query;

    const posts = await Post.find()
      .populate("author")
      .sort({ createdAt: -1 }) // opcional: ordena do mais novo pro mais antigo
      .lean();

    // adiciona contagem de likes e se o usuário atual curtiu
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({ post: post._id });
        const liked = userId
          ? !!(await Like.findOne({ post: post._id, user: userId }))
          : false;

        return {
          ...post,
          likes: likeCount,
          liked,
        };
      })
    );

    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Erro ao buscar posts:", err.message);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
};
