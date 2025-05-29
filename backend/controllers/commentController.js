const commentService = require("../services/commentService");

exports.createComment = async (req, res) => {
  const { userId, postId, content } = req.body;
  try {
    const comment = await commentService.addComment({
      userId,
      postId,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Erro ao comentar", details: err.message });
  }
};
