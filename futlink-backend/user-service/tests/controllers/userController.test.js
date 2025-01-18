const UserController = require("../../src/controllers/userController");
const UserService = require("../../src/services/userService");
const httpMocks = require("node-mocks-http");

jest.mock("../../src/services/userService");

describe("UserController", () => {
  let userController;
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    userController = new UserController();
    mockRequest = httpMocks.createRequest();
    mockResponse = httpMocks.createResponse();
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and return 201 with user data", async () => {
      // Mock request body and file
      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
        cpf: "123.456.789-01",
        birth: "2000-01-01",
        phone: "123456789",
        password: "password",
        height: 1.8,
        weight: 70,
        primaryPosition: "forward",
        secondaryPosition: "midfielder",
        manager: "manager1",
        address: "123 Test Street",
        imageUrl: null,
      };
      mockRequest.file = {
        originalname: "test.jpg",
        mimetype: "image/jpeg",
        buffer: Buffer.from("test"),
      };

      // Mock service method
      const mockUser = {
        id: 1,
        ...mockRequest.body,
      };
      UserService.prototype.createUser.mockResolvedValue(mockUser);

      // Call the method
      await userController.createUser(mockRequest, mockResponse);

      // Assert response
      expect(mockResponse.statusCode).toBe(201);
      expect(mockResponse._getJSONData()).toEqual(mockUser);

      // Assert service interaction
      expect(UserService.prototype.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
          cpf: "12345678901",
        }),
        mockRequest.file
      );
    });

    it("should return 400 if service throws an error", async () => {
      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
      };

      const errorMessage = "User creation failed";
      UserService.prototype.createUser.mockRejectedValue(new Error(errorMessage));

      await userController.createUser(mockRequest, mockResponse);

      expect(mockResponse.statusCode).toBe(400);
      expect(mockResponse._getJSONData()).toEqual({ error: errorMessage });
    });
  });
});
