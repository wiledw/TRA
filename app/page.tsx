"use client"
import React, { useState, useEffect } from 'react';
import { Box, PaletteMode } from '@mui/material';
import NavBar from './components/navbar';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import getLPTheme from './getLPTheme';
import { useRouter } from 'next/navigation';
import backgroundPic from 'app/img/TMU Campus.png';

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
      if (user) {
        const { data } = await supabase.from('user').select('*').single();
        setUserRole(data.role);
        console.log(userRole);
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
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary', 
          minHeight: '100vh',
          paddingTop: '64px', 
        }}
      >
      </Box>
    </ThemeProvider>
    <Image
      src={backgroundPic}
      alt="Picture of the TMU Campus"
    />
  );
}
