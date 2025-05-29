const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const statsRoutes = require("./routes/statsRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const deviceTokenRoutes = require("./routes/deviceToken");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notification", notificationRoutes);

app.use("/api/device-token", deviceTokenRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));
