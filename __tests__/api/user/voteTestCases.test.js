import { describe, test, expect } from '@jest/globals';
import { GET as upVoteGET } from '../../../app/api/user/upVote/route';
import { GET as downVoteGET } from '../../../app/api/user/downVote/route';
import { NextRequest } from 'next/server';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    rpc: jest.fn((procedure) => ({
      data: { success: true },
      error: null
    }))
  }))
}));

describe('Vote API Tests', () => {
  beforeAll(() => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  // UpVote Tests
  test('Successfully upvote a post', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/upVote?postId=123');
    const response = await upVoteGET(request);
    expect(response.status).toBe(200);
  });

  test('Fail upvote with missing postId', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/upVote');
    const response = await upVoteGET(request);
    expect(response.status).toBe(400);
  });

  // DownVote Tests
  test('Successfully downvote a post', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/downVote?postId=123');
    const response = await downVoteGET(request);
    expect(response.status).toBe(200);
  });

  test('Fail downvote with missing postId', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/downVote');
    const response = await downVoteGET(request);
    expect(response.status).toBe(400);
  });
}); 