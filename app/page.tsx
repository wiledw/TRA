"use client"
import React, { useState, useEffect } from 'react';
import { Box, PaletteMode } from '@mui/material';
import NavBar from './components/navbar';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import getLPTheme from './getLPTheme';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import backgroundPic from '../app/img/TMUCampus.png';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const supabase = createClientComponentClient();
  
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <NavBar
        mode="light" 
        toggleColorMode={toggleColorMode}
        user={user}
        role={userRole}
        handleLogout={handleLogout}
      />
      
        <div style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh"

        }}>

        <Image
          src={backgroundPic}
          alt="Picture of the TMU Campus"
          objectFit='cover'
          placeholder="blur"
          quality={100}
          fill={true}
          sizes="100vw"
          style={{
            objectFit: 'cover',  
          }}
        />
        </div>
        <h1 style={{
          paddingTop: "20vh",
          fontFamily: "arial",
          fontSize: "3.5rem",
          fontWeight: "900",
          textAlign: "center",
          color: "red"
        }}> TMU Report App</h1>

    </ThemeProvider>
  );
}
