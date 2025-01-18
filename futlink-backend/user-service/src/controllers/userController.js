const UserService = require("../services/userService");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Criar usuário com upload de imagem
  async createUser(req, res) {
    const {
      username,
      email,
      cpf,
      birth,
      phone,
      password,
      height,
      weight,
      primaryPosition,
      secondaryPosition,
      manager,
      address, // Endereço incluído
    } = req.body;
    const file = req.file;

    try {
      let imageUrl = null;

      // Verifica se há arquivo para upload
      if (file) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (error) => {
          console.error("Upload error:", error);
          throw new Error("Failed to upload image");
        });

        blobStream.end(file.buffer);

        // Gera a URL pública da imagem
        const [url] = await blob.getSignedUrl({
          action: "read",
          expires: "03-01-2030", // Data de expiração da URL
        });

        imageUrl = url; // Atribui a URL ao campo imageUrl
      }

      // Chama o serviço para criar o usuário com os dados e a URL da imagem
      const newUser = await this.userService.createUser(
        {
          username,
          email,
          cpf,
          birth,
          phone,
          password,
          height,
          weight,
          primaryPosition,
          secondaryPosition,
          manager,
          address, // Inclui o endereço no payload
          imageUrl, // Inclui a URL da imagem
        }
      );

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Buscar usuário por ID
  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  // Atualizar usuário com upload de imagem
  async updateUser(req, res) {
    const { id } = req.params;
    const { username, email, cpf, birth, phone, password, height, weight, primaryPosition, secondaryPosition, manager, address } = req.body;
    const file = req.file;

    try {
      const updatedUser = await this.userService.updateUser(id, {
        username,
        email,
        cpf,
        birth,
        phone,
        password,
        height,
        weight,
        primaryPosition,
        secondaryPosition,
        manager,
        address, // Atualizando o endereço também
      }, file);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Deletar usuário
  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const result = await this.userService.deleteUser(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }

  // Obter todos os usuários
  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  }
}

module.exports = UserController;
