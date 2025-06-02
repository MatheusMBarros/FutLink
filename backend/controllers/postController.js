const postService = require("../services/postService");

exports.createPost = async (req, res) => {
  try {
    const { author, content, mediaUrl, type } = req.body;
    const savedPost = await postService.createPost({
      author,
      content,
      mediaUrl,
      type,
    });
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar post", details: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const enrichedPosts = await postService.getAllPostsWithLikes(userId);
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.warn("Erro ao buscar posts:", err.message);
    res.status(200).json([]);
  }
};
