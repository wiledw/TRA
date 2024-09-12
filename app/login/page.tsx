"use client";

import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Image from 'next/image';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSignUp = async () => {
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
  
      if (res.error) {
        // Handle other potential errors
        alert(`Sign up failed: ${res.error.message}`);
        
      } else {
        setVerificationMessage(true); // Show verification message if signup is successful
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        alert(`Sign in failed: ${error.message}`);
        setEmail(""); // Clear the email input
        setPassword(""); // Clear the password input
      } else {
        setUser(data.user); // Set the user data if sign-in is successful
        router.refresh(); // Refresh the router to update the state
        setEmail(""); // Clear the email input
        setPassword(""); // Clear the password input
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleSignInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    setUser(res);
    router.refresh();
    setEmail("");
    setPassword("");
  };

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  if (user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="mb-4 text-xl font-bold text-blue-700 dark:text-gray-300">
            You&apos;re logged in
          </h1>
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-md bg-red-400 text-white hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <h1>loading..</h1>;
  }

  return (
    <main className="h-screen flex items-center justify-center bg-green-400 p-6">
      <div className="bg-gray-200 p-8 rounded-lg shadow-md w-96">
        {verificationMessage ? (
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-blue-700">
              Please check your email to verify your account!
            </h2>
          </div>
        ) : isSignUp ? (
          <>
            <h2 className="text-center mb-4 text-lg font-bold text-black">Sign Up</h2>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="mb-4 w-full p-3 rounded-md border border-gray-100 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="mb-4 w-full p-3 rounded-md border border-gray-100 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-4 w-full p-3 rounded-md border border-gray-100 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSignUp}
              className="w-full mb-2 p-3 rounded-md bg-blue-950 text-white hover:bg-blue-700 focus:outline-none"
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)} // Switch to Sign In
              className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            >
              Already have an account? Sign In
            </button>
          </>
        ) : (
          <>
            <h2 className="text-center mb-4 text-lg font-bold text-black">Sign In</h2>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-4 w-full p-3 rounded-md border border-gray-100 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSignIn}
              className="w-full mb-2 p-3 rounded-md bg-blue-950 text-white hover:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)} // Switch to Sign Up
              className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            >
              Don't have an account? Sign Up
            </button>
            <button
              onClick={handleSignInWithGoogle}
              className="w-full mt-2 p-3 rounded-md bg-white text-gray-800 border border-gray-300 flex items-center justify-center  focus:outline-none"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Sign in with Google"
                width={24} 
                height={24} 
                className="mr-2"
              />
              Sign In with Google
            </button>
          </>
        )}
      </div>
    </main>
  );
}