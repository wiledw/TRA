import { describe, test, expect } from '@jest/globals';
import { GET as banUser } from '../../../app/api/admin/banUser/route';
import { GET as unbanUser } from '../../../app/api/admin/unbanUser/route';
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

describe('Ban Actions API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ban User Tests
  test('Successfully ban a user', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/banUser?userId=123');
    const response = await banUser(request);
    expect(response.status).toBe(200);
  });

  test('Fail ban with missing userId', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/banUser');
    const response = await banUser(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('User ID is required');
  });

  // Unban User Tests
  test('Successfully unban a user', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/unbanUser?userId=123');
    const response = await unbanUser(request);
    expect(response.status).toBe(200);
  });

  test('Fail unban with missing userId', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/unbanUser');
    const response = await unbanUser(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('User ID is required');
  });
});
