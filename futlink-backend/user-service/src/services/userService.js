const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const UserModel = require("../models/userModel");
const storage = new Storage();

class UserService {
  constructor(db) {
    this.db = db || require("../../firebase-config").db;
    this.usersCollection = this.db.collection("users");
    this.bucket = storage.bucket("futlink-fc7bc.firebasestorage.app");
  }

  async processAndUploadImage(file) {
    const tempDir = path.resolve(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = path.resolve(tempDir, file.originalname);
    const compressedPath = tempPath.replace(/\.(\w+)$/, ".jpg");

    await sharp(file.buffer)
      .resize(800, 800, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    const destination = `users/${Date.now()}_${file.originalname}`;

    await this.bucket.upload(compressedPath, {
      destination,
      metadata: {
        contentType: "image/jpeg",
      },
    });

    fs.unlinkSync(compressedPath);

    return destination;
  }

  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validateCPF(cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
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
    console.log(data)
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
      const imageId = await this.processAndUploadImage(file);
      newUser.imageId = imageId;
      newUser.profileImageUri = `https://storage.googleapis.com/${this.bucket.name}/${imageId}`;
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
}

module.exports = UserService;
