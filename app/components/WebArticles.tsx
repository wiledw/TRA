'use client';


export type WebArticle = {
  id?: number;
  created_at?: string;
  title: string;

}


export default function WebArticles(webArticle: { title }): {

  webArticle:WebArticle
} {
  
  return <div className="border px-4 py-3 cursor-pointer hover:bg-gray-900">{title}</div>;
}
