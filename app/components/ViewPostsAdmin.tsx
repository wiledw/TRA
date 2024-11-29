"use client";

import { useEffect, useState, FormEvent } from "react";
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import pushPin from "../img/push_pin.png";

const Posts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const supabase = createClientComponentClient();

    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string>("");

    const [pinNotif, setPinNotif] = useState(false);
    const [archiveNotif, setArchiveNotif] = useState(false);
    const [banNotif, setBanNotif] = useState(false);
    const [unbanNotif, setUnbanNotif] = useState(false);

    const router = useRouter();

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

    // Styling for comment popup
    const customStyles1 = {
        overlay: {
            backgroundColor: 'rgba(209, 209, 209, 0.6)'
        },
        content: {
            top: '75%',
            left: '75%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-25%',
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
        fetch ('/api/admin/getPostsCurrent')
            .then((res) => res.json())
            .then((data) => setPosts(data || []))
            .catch(error => console.error(
                "Error fetching data: ", error));
    }, []);

    // Pinning post using API
    const pinPost = async (postId: string) => {
        const postIndex = posts.findIndex((post) => post.id === postId);
        console.log(postIndex);
        if (postIndex === -1) return;

        fetch(`api/admin/pinPost?postId=${postId}`)
        .catch(error => console.error(
            "Error fetching data: ", error
        ));

        // Set to open notification that post has been pinned
        setPinNotif(true);

    }

    const archivePost = async (postId: string) => {
        const postIndex = posts.findIndex((post) => post.id === postId);
        console.log(postIndex);
        if (postIndex === -1) return;

        fetch(`api/admin/archivePost?postId=${postId}`)
        .catch(error => console.error(
            "Error fetching data: ", error
        ));

        // Set to open notification that the post has been archived
        setArchiveNotif(true);
    }

    const banUser = async (userId: string) => {
        const postIndex = posts.findIndex((post) => post.user.id === userId);
        console.log(postIndex);
        if (postIndex === -1) return;

        fetch(`api/admin/banUser?userId=${userId}`)
        .catch(error => console.error(
            "Error fetching data: ", error
        ));

        // Set to open notification that a user has been banned
        setBanNotif(true);
    }

    const unbanUser = async (userId: string) => {
        const postIndex = posts.findIndex((post) => post.user.id === userId);
        console.log(postIndex);
        if (postIndex === -1) return;

        fetch(`api/admin/unbanUser?userId=${userId}`)
        .catch(error => console.error(
            "Error fetching data: ", error
        ));

        // Set to open notification that a user has been unbanned
        setUnbanNotif(true);
    }

    // Add admin comment to post using API
    const comment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const postId = (event.currentTarget.elements[0] as HTMLInputElement).value;
        console.log((event.currentTarget.elements[0] as HTMLInputElement).value);
        const adminComment = (event.currentTarget.elements[1] as HTMLInputElement).value;

        // API call
        await fetch('api/admin/addComment', {
            method: "POST",
            body: JSON.stringify({post_id: postId, admin_comment: adminComment})
        });

        window.location.reload();
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
                {post.user.banned  ?
                <div>
                    <button
                        onClick={() => unbanUser(post.user.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Unban User
                    </button>
                    <Modal isOpen={banNotif} onRequestClose={() => setUnbanNotif(false)} style={customStyles}>
                    <div>
                        <div className="flex text-lg text-center bg-white text-black">
                        <p>This user has been unbanned.</p>
                        </div>
                        <div>
                        <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setUnbanNotif(false)}>Return</button>
                        </div>
                    </div>
                    </Modal>
                </div>
                :
                <div>
                    <button
                        onClick={() => banUser(post.user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Ban User
                    </button>
                    <Modal isOpen={unbanNotif} onRequestClose={() => setBanNotif(false)} style={customStyles}>
                    <div>
                        <div className="flex text-lg text-center bg-white text-black">
                        <p>This user has been banned.</p>
                        </div>
                        <div>
                        <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setBanNotif(false)}>Return</button>
                        </div>
                    </div>
                    </Modal>
                </div>}
                </div>
            </div>
            {post.archived ?
            <div className="flex items-end justify-between mt-4">
                <p className="font-semibold">Post is currently archived</p>
                <button onClick={() => pinPost(post.id)}
                className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-900 float-end">
                    Pin Post
                </button>
                <Modal isOpen={pinNotif} onRequestClose={() => setPinNotif(false)} style={customStyles}>
                    <div>
                        <div className="flex text-lg text-center bg-white text-black">
                        <p>The post has been pinned.</p>
                        </div>
                        <div>
                        <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setPinNotif(false)}>Return</button>
                        </div>
                    </div>
                </Modal>
            </div>
            :
            <div className="flex items-end justify-between mt-4">
                <button onClick={() => archivePost(post.id)}
                className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 float-end">
                Archive Post
                </button>
                <Modal isOpen={archiveNotif} onRequestClose={() => setArchiveNotif(false)} style={customStyles}>
                <div>
                    <div className="flex text-lg text-center bg-white text-black">
                    <p>The post has been archived.</p>
                    </div>
                    <div>
                    <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setArchiveNotif(false)}>Return</button>
                    </div>
                </div>
                </Modal>
                <button onClick={() => pinPost(post.id)}
                className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-900 float-end">
                    Pin Post
                </button>
                <Modal isOpen={pinNotif} onRequestClose={() => setPinNotif(false)} style={customStyles}>
                <div>
                    <div className="flex text-lg text-center bg-white text-black">
                    <p>The post has been pinned.</p>
                    </div>
                    <div>
                    <button className="flex mr-auto ml-auto max-w-fit px-4 py-2 rounded bg-slate-500 hover:bg-slate-600" onClick={() => setPinNotif(false)}>Return</button>
                    </div>
                </div>
                </Modal>
            </div>}
            <div className="flex items-start justify-between mt-4 text-lg font-bold">
                Admin Comments:
            </div>
            <p className="flex items-start justify-between mt-4">
                {post.admin_comment || "None"}
            </p>
            <div>
                <p className="flex items-start justify-between mt-4 font-semibold">
                    Enter Admin Comment Here:
                </p>
            </div>
            <div>
                <form className="pt-2 pb-2" onSubmit={comment}>
                    <label className="pl-1 pr-1 text-black border-black border-spacing-2">
                        Post ID: <input className="border-black" type="text" name="post_id" defaultValue={post.id} readOnly={true}/>
                    </label>
                    <label className="pl-1 pr-1 text-black border-black border-spacing-2">
                        Enter your comment: <input type="text" name="admin_comment" required/>
                    </label>
                    <button className="pl-1 pr-1 text-black bg-slate-300 hover:bg-slate-400 rounded" type="submit">Add Admin Comment</button>
                </form>
            </div>
            </div>
        ))}
        </div>
    );
};

export default Posts;
