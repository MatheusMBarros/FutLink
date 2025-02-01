// src/app.js

const express = require("express");
const authRoute = require("./interface/authRoute");
const app = express();
require("dotenv").config(); // Carrega as variáveis do arquivo .env

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authRoute);

app.listen(PORT, () => {
	console.log(`Auth Service running on port ${PORT}`);
});
