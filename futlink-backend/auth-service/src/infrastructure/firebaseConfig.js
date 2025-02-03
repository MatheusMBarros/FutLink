require("dotenv").config(); // Carregar as variáveis do .env
const admin = require("firebase-admin");

const serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH); // Caminho para o arquivo de credenciais

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
