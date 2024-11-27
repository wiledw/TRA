import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// takes a postId search parameter, arhives post with that id, returns null on success
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'post ID is required' }, { status: 400 });
    }

    // archiving post
    const { data, error } = await supabase
        .from('posts')
        .update({ archived: true })
        .eq('id', postId);

    if (error) {
      console.error('Error archiving post:', error);
      return NextResponse.json({ error: 'Error archiving post' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}