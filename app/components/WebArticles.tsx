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
 
}
