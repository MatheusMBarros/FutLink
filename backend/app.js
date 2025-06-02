const express = require("express");
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
const teamRoutes = require("./routes/teamRoutes");
const debugRoutes = require("./routes/debugRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/device-token", deviceTokenRoutes);
app.use("/api/teams", teamRoutes);

module.exports = app;
