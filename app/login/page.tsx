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
  },[supabase.auth]);

  const handleSignUp = async () => {
    // Define the regex pattern for the allowed email domain
    const emailPattern = /^[^\s@]+@torontomu\.ca$/;

    // Check if the email matches the pattern
    if (!emailPattern.test(email)) {
      alert('Please use a valid @torontomu.ca email address.');
      setEmail(""); // Clear the email input
      setPassword(""); // Clear the password input
      return;
    }

    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL}`,
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
        router.push('/');
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleSignInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL}`,
        },
      });
  
      if (error) {
        alert(`Sign in failed: ${error.message}`);
      } else {
        // No need to set the user directly here. After the redirect and authentication process,
        // Supabase will handle it and we can get the user afterward.
        console.log("Redirecting to:", data.url);  // Check where the redirection happens.
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <h1>loading..</h1>;
  }

  return (
    <main className="h-screen flex items-center justify-center bg-white p-6">
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
            <p className="text-center mt-4 mb-2 text-gray-600">Only TMU email</p>
            <button
              onClick={handleSignInWithGoogle}
              className="w-full mb-6 p-3 rounded-md bg-white text-gray-800 border border-gray-300 flex items-center justify-center focus:outline-none"
            >
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Sign in with Google"
                width={24}
                height={24}
                className="mr-2"
              />
              Sign Up with Google
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
            <p className="text-center mt-4 mb-2 text-gray-600">Only TMU email</p>
            <button
              onClick={handleSignInWithGoogle}
              className="w-full mb-6 p-3 rounded-md bg-white text-gray-800 border border-gray-300 flex items-center justify-center focus:outline-none"
            >
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Sign in with Google"
                width={24}
                height={24}
                className="mr-2"
              />
              Sign In with Google
            </button>
            <button
              onClick={() => setIsSignUp(true)} // Switch to Sign Up
              className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            >
              Don&apos;t have an account? Sign Up
            </button>
          </>
        )}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
        >
          Go back to Home
        </button>
      </div>
    </main>
  );
}