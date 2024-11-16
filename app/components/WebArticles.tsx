'use client';


export type WebArticle = {
  id?: number;
  created_at?: string;
  title: string;

}


export default function WebArticles({webArticle: { title }}: {

  webArticle:WebArticle
}) {
  const { vote } = changeVote()
  
  return <div className="border flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-900">
    
    <h2>{title}</h2> 
    <div className="grid text-center">
      <span onClick={() => vote(id)}>upvote</span>
      <span> votes</span>
      <span onClick={() => changeVote(id, true)}>downvote</span>

    
    </div>
  
  </div>;
}
