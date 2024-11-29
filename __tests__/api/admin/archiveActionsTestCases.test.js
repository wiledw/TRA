import { describe, test, expect } from '@jest/globals';
import { GET as archivePost } from '../../../app/api/admin/archivePost/route';
import { GET as unarchivePost } from '../../../app/api/admin/unarchivePost/route';
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

describe('Archive Actions API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  // Archive Post Tests
  test('Successfully archive a post', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/archivePost?postId=123');
    const response = await archivePost(request);
    expect(response.status).toBe(200);
  });

  test('Fail archive with missing postId', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/archivePost');
    const response = await archivePost(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('post ID is required');
  });

  // Unarchive Post Tests
  test('Successfully unarchive a post', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/unarchivePost?postId=123');
    const response = await unarchivePost(request);
    expect(response.status).toBe(200);
  });

  test('Fail unarchive with missing postId', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/unarchivePost');
    const response = await unarchivePost(request);
    expect(response.status).toBe(400);
  });
}); 