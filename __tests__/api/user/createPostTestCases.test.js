import { describe, test, expect } from '@jest/globals';
import { POST } from '../../../app/api/user/createPost/route';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 1, title: 'Test Post' }],
          error: null
        }))
      }))
    }))
  }))
}));

describe('Create Post API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  test('Successfully create a post', async () => {
    const request = new Request('http://localhost:3000/api/user/createPost', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Post',
        description: 'Test Description',
        image: 'test.jpg',
        locations: ['MAC'],
        created_by: 'user123'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  test('Fail with missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/user/createPost', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Post',
        // missing required fields on purpose
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
