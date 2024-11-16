'use client';


export type WebArticle = {
  username: string;
  id?: number;
  postMadeAt?: string;
  postTitle: string;
  description: string;
  geolocation: string;
  votes?: any[];

}


export default function WebArticles({
  webArticle: {
    username,
    id,
    postTitle,
    description,
    geolocation,
    votes
  
  }
}: {

  webArticle:WebArticle
}) {
  const { vote } = changeVote()
  
  return <div className="border flex items-center justify-between">
    <h2>{postTitle}</h2> 
    <div className="grid text-center">
      <span onClick={() => vote(id)}>upvote</span>
      <span>{votes?.length} votes</span>
      <span onClick={() => changeVote(id, true)}>downvote</span>

    
    </div>
  
  </div>;
}
