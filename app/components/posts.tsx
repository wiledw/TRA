"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  // Fetch posts with the creator's full name
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, title, description, image, up_vote, down_vote, created_at, created_by`
        );

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
    };

    fetchPosts();
  }, [supabase]);

  // Update votes in the database and locally
  const handleVote = async (postId: string, voteType: "up_vote" | "down_vote") => 
    {
        const postIndex = posts.findIndex((post) => post.id === postId);
        console.log(postIndex);
        if (postIndex === -1) return;

        const updatedVoteCount = posts[postIndex][voteType] + 1;

        const { error } = await supabase
        .from("posts")
        .update({ [voteType]: updatedVoteCount })
        .eq("id", postId);
        
        console.log("voteType:", [voteType]);
        console.error("Error updating vote:", error);
        if (error) {
        console.error("Error updating vote:", error);
        return;
        }

        // Update the post locally
        const updatedPosts = [...posts];
        updatedPosts[postIndex][voteType] = updatedVoteCount;
        setPosts(updatedPosts);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.description}</p>
          {post.image && (
            <div className="mb-4">
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="rounded-md"
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              Created by: {post.created_by || "Unknown"}
            </p>
            <p className="text-gray-500 text-sm">
              Posted on: {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">
              Votes: {post.up_vote - post.down_vote}
            </div>
            <div className="flex">
              <button
                onClick={() => handleVote(post.id, "up_vote")}
                className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Upvote
              </button>
              <button
                onClick={() => handleVote(post.id, "down_vote")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Downvote
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;