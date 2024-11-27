import { describe, test, expect } from '@jest/globals';
import { GET as getCurrentPosts } from '../../../app/api/user/getPostsCurrent/route';
import { GET as getArchivedPosts } from '../../../app/api/user/getPostsArchived/route';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        match: jest.fn(() => ({
          order: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [
                { 
                  id: 1, 
                  title: 'Test Post',
                  user: { email: 'test@test.com', banned: false }
                }
              ],
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}));

describe('Get Posts API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  // Current Posts Tests
  test('Successfully fetch current posts', async () => {
    const response = await getCurrentPosts();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data[0]).toHaveProperty('user.email');
  });

  // Archived Posts Tests
  test('Successfully fetch archived posts', async () => {
    const response = await getArchivedPosts();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data[0]).toHaveProperty('user.email');
  });
}); 