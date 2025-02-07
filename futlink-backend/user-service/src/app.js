// src/app.js

const express = require("express");
const userRoute = require("./interface/userRoute");
const app = express();
require("dotenv").config(); // Carrega as variáveis do arquivo .env

const PORT = process.env.PORT;

app.use(express.json());
app.use(userRoute);

app.listen(PORT, () => {
	console.log(`User Service running on port ${PORT}`);
});
