// tests/post.test.js

const request = require('supertest');
const app = require('../app');

describe('GET /api/posts', () => {
  it('debería devolver una lista de publicaciones paginada', async () => {
    const response = await request(app).get('/api/posts?page=1&limit=2');
    expect(response.statusCode).toBe(200);
    expect(response.body.posts.length).toBeLessThanOrEqual(2);
  });
});
