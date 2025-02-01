require('dotenv').config(); // Carregar as variáveis do .env
const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH); // Caminho para o arquivo de credenciais

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Usar o bucket definido no .env
});





const db = admin.firestore();
const bucket = admin.storage().bucket(); 
const auth = admin.auth()

module.exports = { db, bucket, auth };
