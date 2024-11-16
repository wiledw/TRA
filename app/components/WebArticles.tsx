'use client';


export type WebArticle = {
  username: string;
  id?: number;
  created_at?: string;
  title: string;
  description: string;
  geolocation: string;
  votes?: any[];

}


export default function WebArticles({
  webArticle: {
    username,
    id,
    title,
    description,
    geolocation,
    votes
  
  }
}: {

  webArticle:WebArticle
}) {
  const { vote } = changeVote()
  
  return <div className="border flex items-center justify-between px-4 py-3 cursor-pointer">
    <h2>{title}</h2> 
    <div className="grid text-center">
      <span onClick={() => vote(id)}>upvote</span>
      <span>{votes?.length} votes</span>
      <span onClick={() => changeVote(id, true)}>downvote</span>

    
    </div>
  
  </div>;
}
