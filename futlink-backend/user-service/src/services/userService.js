const { Storage } = require("@google-cloud/storage");
const UserModel = require("../models/userModel");
const {storageBucket} = require("../../firebase-config");
const sharp = require("sharp");


class UserService {
  constructor(db) {
    this.db = db || require("../../firebase-config").db;
    this.usersCollection = this.db.collection("users");
    this.bucket = storageBucket; // Usa o bucket inicializado no Firebase
  }

  async processAndUploadImage(file) {
    const fileName = `profileImage/${Date.now()}-${file.originalname}`;
    const blob = this.bucket.file(fileName);

    return new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      blobStream.on("error", (error) => {
        console.error("Erro ao fazer upload do arquivo:", error.message);
        reject(new Error("Erro ao fazer upload do arquivo."));
      });

      blobStream.on("finish", () => {
        const fileUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
        resolve(fileUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  async verificarCpfCadastrado(cpf) {
    try {
      const snapshot = await this.usersCollection.where('cpf', '==', cpf).get();
      return !snapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar CPF:", error.message);
      return false;
    }
  }

  async createUser(data, file) {
    if (!data.username || !data.email || !data.cpf) {
      throw new Error("Username, email, and CPF are required");
    }

    if (!this.validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    if (!this.validateCPF(data.cpf)) {
      throw new Error("Invalid CPF format");
    }

    if (await this.verificarCpfCadastrado(data.cpf)) {
      throw new Error("CPF has already been used");
    }

    const newUser = new UserModel(data);

    if (file) {
      const fileUrl = await this.processAndUploadImage(file);
      newUser.profileImageUri = fileUrl;
    }

    const userRef = this.usersCollection.doc();
    newUser.id = userRef.id;
    await userRef.set(newUser.toJSON());

    return newUser;
  }

  async updateUser(id, data, file) {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }

    if (data.email && !this.validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    if (data.cpf && !this.validateCPF(data.cpf)) {
      throw new Error("Invalid CPF format");
    }

    if (file) {
      if (user.imageId) {
        await this.bucket.file(user.imageId).delete();
      }

      const newImageId = await this.processAndUploadImage(file);
      user.imageId = newImageId;
      user.profileImageUri = `https://storage.googleapis.com/${this.bucket.name}/${newImageId}`;
    }

    user.update(data);
    const userRef = this.usersCollection.doc(id);
    await userRef.update(user.toJSON());
    return user;
  }

  async getAllUsers() {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getUserById(id) {
    const userRef = this.usersCollection.doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.imageId) {
      await this.bucket.file(user.imageId).delete();
    }

    const userRef = this.usersCollection.doc(id);
    await userRef.delete();

    return { message: "User and associated image deleted successfully" };
  }

  async addAddress(userId, address) {
    const userRef = this.usersCollection.doc(userId);
    const addressRef = userRef.collection('address').doc();
    address.id = addressRef.id;
    await addressRef.set(address);
    return address;
  }

  async getAddresses(userId) {
    const addressesSnapshot = await this.usersCollection.doc(userId).collection('address').get();
    return addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateAddress(userId, addressId, address) {
    const addressRef = this.usersCollection.doc(userId).collection('address').doc(addressId);
    await addressRef.update(address);
    return { id: addressId, ...address };
  }

  async deleteAddress(userId, addressId) {
    const addressRef = this.usersCollection.doc(userId).collection('address').doc(addressId);
    await addressRef.delete();
    return { message: "Address deleted successfully" };
  }

  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validateCPF(cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }
}

module.exports = UserService;
