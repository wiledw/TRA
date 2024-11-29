import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';
export const revalidate = 1;

// takes no input, returns array of jsons of non-archived posts by non-banned users with all post columns plus email and ban status of user who created post on success
export async function GET() {
  try {
    // Fetch all posts from the 'posts' table where archived is false and user is not banned, order descending by date created
    const { data, error } = await supabase
      .from('posts')
      .select('*, user(email, banned)')
      .match({ 'archived': false })
      .order('pinned', {ascending: false})
      .order('created_at', { ascending: false });
      
    
    
    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }

    const filtered = data.filter(item => item.user.banned !== true);
    return NextResponse.json(filtered, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}