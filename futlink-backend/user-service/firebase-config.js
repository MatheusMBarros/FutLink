require("dotenv").config();  // Carrega as variáveis de ambiente

const admin = require("firebase-admin");
const path = require("path");

// Carrega o caminho para o arquivo de chave da conta de serviço a partir do .env
const serviceAccount = require(path.resolve(process.env.FIREBASE_PRIVATE_KEY_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,  // Usa o bucket do Firebase configurado no .env
});

const db = admin.firestore(); // Instância do Firestore
const auth = admin.auth(); // Instância de autenticação
const storage = admin.storage().bucket(); // Instância do Storage

module.exports = { db, auth, storage };
