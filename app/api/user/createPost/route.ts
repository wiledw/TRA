import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const {
      title,
      description,
      image,
      locations,
      created_by
    } = body;

    // Validate required fields
    if (!title || !description || !image || !created_by) {
      return NextResponse.json(
        { error: 'Title, description, and image are required fields.' },
        { status: 400 }
      );
    }

    // Insert the new post
    const { data, error } = await supabase.from('posts').insert({
      title: title,
      description: description,
      image: image,
      locations: locations || [], // Defaults to empty array if not provided
      created_by: created_by
    }).select();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: 'Error creating post.' }, { status: 500 });
    }

    // Return the created post
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error occurred.' },
      { status: 500 }
    );
  }
}