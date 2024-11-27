import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// takes a postId search parameter, unarhives post with that id, returns null on success
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'post ID is required' }, { status: 400 });
    }

    // unarchiving post
    const { data, error } = await supabase
        .from('posts')
        .update({ archived: false })
        .eq('id', postId);

    if (error) {
      console.error('Error unarchiving post:', error);
      return NextResponse.json({ error: 'Error unarchiving post' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}