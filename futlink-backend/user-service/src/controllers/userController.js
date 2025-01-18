const UserService = require("../services/userService");
const {auth} = require("../../firebase-config");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res) {
    const { file, body } = req;

    try {
      const newUser = await this.userService.createUser(body, file);
      res.status(201).json({ message: "Usuário criado com sucesso!", newUser });
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      res.status(500).json({ error: error.message });
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
