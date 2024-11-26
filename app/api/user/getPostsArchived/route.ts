import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch all posts from the 'posts' table where archived is true and user is not banned, order descending by date created
    const { data, error } = await supabase
      .from('posts')
      .select('*, user(email)')
      .match({ 'archived': false, 'user.banned': false })
      .order('created_at', { ascending: false });
      

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}