import { describe, test, expect } from '@jest/globals';
import { GET as pinPost } from '../../../app/api/admin/pinPost/route';
import { NextRequest } from 'next/server';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }))
}));

describe('Pin Actions API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Pin Post Tests
  test('Successfully pin a post', async () => {
    const request = new NextRequest(new Request('http://localhost:3000/api/admin/pinPost?postId=123'));
    const response = await pinPost(request);
    expect(response.status).toBe(200);
  });

  test('Fail pin with missing postId', async () => {
    const request = new NextRequest(new Request('http://localhost:3000/api/admin/pinPost'));
    const response = await pinPost(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('post ID is required');
  });
}); 