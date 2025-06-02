// __tests__/services/postService.test.js
const Post = require("../../models/Post");
const Like = require("../../models/Like");
const {
  createPost,
  getAllPostsWithLikes,
} = require("../../services/postService");

jest.mock("../../models/Post");
jest.mock("../../models/Like");

describe("Serviço de Posts", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createPost", () => {
    it("deve criar um novo post", async () => {
      const data = { content: "Postagem de teste", author: "user123" };
      const saveMock = jest.fn().mockResolvedValue({ ...data, _id: "postId" });
      Post.mockImplementation(() => ({ save: saveMock }));

      const result = await createPost(data);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toMatchObject({
        content: data.content,
        author: data.author,
      });
    });
  });

  describe("getAllPostsWithLikes", () => {
    it("deve retornar posts com contagem de likes e likedByCurrentUser", async () => {
      const posts = [
        { _id: "p1", content: "teste", author: {}, createdAt: new Date() },
      ];

      Post.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(posts),
      });
      Like.countDocuments.mockResolvedValue(3);
      Like.findOne.mockResolvedValue({});

      const result = await getAllPostsWithLikes("user1");

      expect(result[0].likes).toBe(3);
      expect(result[0].likedByCurrentUser).toBe(true);
    });
  });
});
