const User = {
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(),
};

// Permite usar `new User(...)` nos testes
User.mockImplementation = (userData) => ({
  ...userData,
  save: jest.fn(),
});

module.exports = User;
