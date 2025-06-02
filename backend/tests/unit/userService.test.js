const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const { registerUser, loginUser } = require("../../services/authService");

const { getUserById, updateUser } = require("../../services/userService");

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Serviço de Usuário", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔐 registerUser
  describe("registerUser", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedSenha");

      const saveMock = jest.fn().mockResolvedValue(true);
      User.mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await registerUser({
        nome: "Matheus",
        email: "matheus@email.com",
        senha: "123456",
        posicao: "Goleiro",
        cidade: "Floripa",
        range: 3000,
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: "matheus@email.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(saveMock).toHaveBeenCalled();
    });

    it("deve lançar erro se o email já estiver em uso", async () => {
      User.findOne.mockResolvedValue({ email: "matheus@email.com" });

      await expect(
        registerUser({
          nome: "Matheus",
          email: "matheus@email.com",
          senha: "123456",
          posicao: "Goleiro",
          cidade: "Floripa",
          range: 3000,
        })
      ).rejects.toThrow("Email já está em uso");
    });
  });

  // 🔑 loginUser
  describe("loginUser", () => {
    it("deve retornar token e dados do usuário com login válido", async () => {
      const fakeUser = {
        _id: "user123",
        email: "matheus@email.com",
        senha: "senhaHash",
        nome: "Matheus",
        posicao: "Goleiro",
        cidade: "Floripa",
        range: 5000,
      };

      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token.jwt");

      const res = await loginUser({
        email: "matheus@email.com",
        senha: "123456",
      });

      expect(res.token).toBe("token.jwt");
      expect(res.user).toMatchObject({
        id: "user123",
        nome: "Matheus",
        email: "matheus@email.com",
      });
    });

    it("deve lançar erro se o usuário não for encontrado", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        loginUser({ email: "naoexiste@email.com", senha: "123" })
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("deve lançar erro se a senha estiver incorreta", async () => {
      User.findOne.mockResolvedValue({ senha: "hash" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        loginUser({ email: "teste@email.com", senha: "errada" })
      ).rejects.toThrow("Senha incorreta");
    });
  });

  // 👤 getUserById
  describe("getUserById", () => {
    it("deve retornar um usuário válido", async () => {
      const fakeUser = { nome: "Matheus", email: "matheus@email.com" };
      const selectMock = jest.fn().mockResolvedValue(fakeUser);
      User.findById.mockReturnValue({ select: selectMock });

      const result = await getUserById("123");
      expect(result).toEqual(fakeUser);
      expect(User.findById).toHaveBeenCalledWith("123");
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ select: selectMock });

      await expect(getUserById("123")).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });

  // 🛠 updateUser
  describe("updateUser", () => {
    it("deve atualizar e retornar o usuário", async () => {
      const updates = { cidade: "Nova Cidade" };
      const fakeUser = { _id: "abc", nome: "Matheus", ...updates };

      User.findByIdAndUpdate.mockResolvedValue(fakeUser);

      const result = await updateUser("abc", updates);
      expect(result).toEqual(fakeUser);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("abc", updates, {
        new: true,
      });
    });

    it("deve lançar erro se o usuário não existir", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateUser("abc", {})).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });
});
