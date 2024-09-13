"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import stockProfilePic from '../img/stockProfilePic.jpg';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserData(data.session.user);
      }
    };

    fetchUserData();
  }, [supabase.auth]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      <Image
        src={userData.user_metadata?.avatar_url || stockProfilePic}
        alt="User Avatar"
        className="rounded-full mx-auto mb-4"
        width={100}
        height={100}
      />
      <h2 className="text-2xl font-semibold">{userData.user_metadata?.full_name}</h2>
      <p className="text-lg text-gray-700">{userData.email}</p>
    </div>
  );
};

export default Profile;
