const likeService = require("../services/likeService");

exports.likePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const result = await likeService.toggleLike(postId, userId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao curtir:", err); // <-- mostra stack completa
    res.status(500).json({ error: "Erro ao curtir", details: err.message });
  }
};
