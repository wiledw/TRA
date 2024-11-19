"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type Post = {
    id: number;
    created_at?: string;
    title: string;
    votes?: any[];
    geolocation: string;
    pin: boolean;
}


export default function ViewPostings({
    post: {
      id,
      title,
      votes,
      geolocation,
      pin
    }
  }: {
    post: Post
  }) {

//Add someoneVoted backend functionality and vote instance functionality for backend.
//How are we handling pin?
return <div className="border flex items-center justify-between">
    <h1>{username} + " " + {geolocation}</h1>
    <h2>{title}</h2>
    <div>
      <span onClick={() => someoneVoted(id, true)}>upvote</span>
      <span>{votes?.length} votes</span>
      <span onClick={() => someoneVoted(id, false)}>downvote</span>
    </div>
  </div>;
}
