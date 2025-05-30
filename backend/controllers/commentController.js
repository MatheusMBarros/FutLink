const commentService = require("../services/commentService");

async function createComment(req, res) {
  try {
    const comment = await commentService.addComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    console.error("Erro ao comentar:", err);
    res.status(500).json({ error: "Erro ao comentar", details: err.message });
  }
}

async function getComments(req, res) {
  try {
    const { postId } = req.params;
    const comments = await commentService.getComments(postId);
    res.json(comments);
  } catch (err) {
    console.error("Erro ao buscar comentários:", err);
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
}

module.exports = {
  createComment,
  getComments,
};
