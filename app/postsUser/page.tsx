"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import ViewPosts from "../components/ViewPostsUser";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import { Box, PaletteMode } from "@mui/material";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const supabase = createClientComponentClient();

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
  

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
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
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          paddingTop: "64px",
        }}
      >
        <ViewPosts />
      </Box>
    </ThemeProvider>
  );
}