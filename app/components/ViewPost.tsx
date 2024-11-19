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
  }) {


return <div className="border flex items-center justify-between">
    <h2>{title}</h2>
    <div>
      <span>upvote</span>
      <span>{votes?.length} votes</span>
      <span>downvote</span>
    </div>
  </div>;
}
