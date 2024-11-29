"use client";

import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import pushPin from "../img/push_pin.png";

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  // Styling for the popup
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(209, 209, 209, 0.6)'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  // Getting logged in user information
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
      if (user) {
        const user_id = user.id;
        const { data: userData } = await supabase.from('user').select('*').eq('id', user_id).single();
        setUserRole(userData.role);
        console.log(userData.role);
      }
    };
    fetchUser();
  }, [supabase.auth, userRole]);

  // Fetch posts using API route
  useEffect(() => {
    fetch('/api/user/getPostsCurrent', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched posts:", data);
            setPosts(data || []);
        })
        .catch(error => console.error("Error fetching data: ", error));
  }, []);



  // Updating the Downvotes in database and locally
  const downVote = async (postId: string) =>
  {
        const postIndex = posts.findIndex((post) => post.id === postId);
        console.log(postIndex);
        if (postIndex === -1) return;

        const updatedVoteCount = posts[postIndex]["down_vote"] + 1;

        // Updating Downvotes on Supabase using API
        fetch (`/api/user/downVote?postId=${postId}`)
        .catch(error => console.error(
          "Error fetching data: ", error
        ));

        console.log("voteType:", ["down_vote"]);

        // Update the post locally
        const updatedPosts = [...posts];
        updatedPosts[postIndex]["down_vote"] = updatedVoteCount;
        setPosts(updatedPosts);
  }

  // Update votes in the database and locally
  const upVote = async (postId: string) =>
    {
        const postIndex = posts.findIndex((post) => post.id === postId);
        console.log(postIndex);
        if (postIndex === -1) return;

        const updatedVoteCount = posts[postIndex]["up_vote"] + 1;

        // Updating Upvotes on Supabase using API
        fetch (`/api/user/upVote?postId=${postId}`)
        .catch(error => console.error(
          "Error fetching data: ", error));

        console.log("voteType:", ["up_vote"]);

        // Update the post locally
        const updatedPosts = [...posts];
        updatedPosts[postIndex]["up_vote"] = updatedVoteCount;
        setPosts(updatedPosts);
  };

  // Use API to report posts
  const reportPost = async (postId: string, userId: string) =>
  {
    const postIndex = posts.findIndex((post) => post.id === postId);
    console.log(postIndex);
    if (postIndex === -1) return;

    console.log(user.id);

    // Fetch API to report the post
    fetch('api/user/reportPost',{
      method: "POST",
      body: JSON.stringify({user_Id: userId, post_Id: postId})
    })

    // Opens up pop up window as feedback for reporting
    setIsOpen(true);

  }


  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-md p-6 mb-6">
          <div>
            {post.pinned ?
              (<Image className="float-right" src={pushPin} alt="Push pin to represent pinned post" width={50} height={50} />
              ) : null
            }
          </div>
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.description}</p>
          <p className="text-lg font-semibold mb-3">
            Location: {post.locations.length > 1 ? post.locations.join(', ') : post.locations[0]}
          </p>
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
              Created by: {post.user.email || "Unknown"}
            </p>
            <p className="text-gray-500 text-sm">
              Posted on: {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">
              Vote Score: {post.up_vote - post.down_vote}
            </div>
            <div className="flex">
              <button
                onClick={() => upVote(post.id)}
                className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Upvote
              </button>
              <button
                onClick={() => downVote(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Downvote
              </button>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <button onClick={() => reportPost(post.id, user.id)}
              className="mr-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 float-end">
              Report Post
            </button>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
              <div>
                <div className="flex text-lg text-center bg-white text-black">
                  <p>The post has been reported to the admin.</p>
                </div>
                <div>
                  <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setIsOpen(false)}>Return</button>
                </div>
              </div>
            </Modal>
          </div>
          <div className="flex items-start justify-between mt-4 text-lg font-bold">
            Admin Comments:
          </div>
          <p className="flex items-start justify-between mt-4">
            {post.admin_comment || "None"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
