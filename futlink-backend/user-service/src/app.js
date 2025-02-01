// src/app.js

const express = require('express');
const userRoute = require('./interface/userRoute');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
