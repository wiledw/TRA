'use client';

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
  })
