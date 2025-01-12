const request = require('supertest');
const app = require('../src/app');

describe('Authentication API', () => {
it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(response.statusCode).toBe(400);
});

  it('should return a token for valid credentials', async () => {
    const response = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});