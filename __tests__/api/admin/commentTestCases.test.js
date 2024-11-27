import { describe, test, expect } from '@jest/globals';
import { POST as addComment } from '../../../app/api/admin/addComment/route';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }))
}));

describe('Admin Comment API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully add admin comment', async () => {
    const request = new Request('http://localhost:3000/api/admin/addComment', {
      method: 'POST',
      body: JSON.stringify({
        post_id: '123',
        admin_comment: 'Test comment'
      })
    });
    const response = await addComment(request);
    expect(response.status).toBe(200);
  });

  test('Fail comment with missing fields', async () => {
    const request = new Request('http://localhost:3000/api/admin/addComment', {
      method: 'POST',
      body: JSON.stringify({
        post_id: '123'
        // missing admin_comment field on purpose
      })
    });
    const response = await addComment(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('post_id and admin_comment are required fields.');
  });
});