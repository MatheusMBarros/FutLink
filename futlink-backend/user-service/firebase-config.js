require("dotenv").config(); // Carrega as variáveis de ambiente

const admin = require("firebase-admin");
const path = require("path");
const express = require("express");
const multer = require("multer");

// Caminho para o arquivo de chave do Firebase
const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_PATH;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_PRIVATE_KEY_PATH não definido no .env");
}

const serviceAccount = require(path.resolve(serviceAccountPath));

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Armazena o bucket do .env
});

const db = admin.firestore(); // Instância do Firestore
const auth = admin.auth(); // Instância de autenticação
const storageBucket = admin.storage().bucket(); // Instância do Storage

module.exports = { db, auth, storageBucket };