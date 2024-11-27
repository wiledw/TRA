import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { post_id, admin_comment } = body;

    // Validate required fields
    if (!post_id || admin_comment === undefined) {
      return NextResponse.json(
        { error: 'post_id and admin_comment are required fields.' },
        { status: 400 }
      );
    }

    // Update the admin_comment column for the specified post
    const { data, error } = await supabase
      .from('posts')
      .update({ admin_comment: admin_comment })
      .eq('id', post_id)
      .select();

    if (error) {
      console.error('Error updating admin comment:', error);
      return NextResponse.json({ error: 'Error updating admin comment.' }, { status: 500 });
    }

    // Return the updated post
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error occurred.' },
      { status: 500 }
    );
  }
}