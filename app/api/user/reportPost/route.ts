import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// takes a json with user_Id and postId, adds new record to reports table, returns array with json of new record added
export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { user_Id, post_Id } = body;

    // Validate required fields
    if (!user_Id || !post_Id) {
      return NextResponse.json(
        { error: 'User ID and Post ID are required.' },
        { status: 400 }
      );
    }

    // Insert a new record into the reports table
    const { data, error } = await supabase.from('reports').insert({
      reported_by: user_Id,
      post_id: post_Id,
    }).select();

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json(
        { error: 'Failed to create a report.' },
        { status: 500 }
      );
    }

    // Return the created report
    console.log(data);
    return NextResponse.json(
      { message: 'Report created successfully.', report: data },
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error occurred.' },
      { status: 500 }
    );
  }
}