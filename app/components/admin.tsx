"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Admin = () => {
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
      <p>This is admin dashboard</p>
    </div>
  );
};

export default Admin;