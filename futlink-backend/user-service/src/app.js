const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Adicionando suporte para CORS
const userRoutes = require('./routes/userRoutes'); // Importando as rotas de usuários

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Habilitando CORS para requisições externas

// Roteamento
app.use('/users', userRoutes); // Rota de usuários

const port = process.env.PORT || 3002;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
