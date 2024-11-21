"use client";

import React from "react";
import NavBar from "../components/navbar";
import ViewPosts from "../components/ViewPosts";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import { Box, PaletteMode } from "@mui/material";

export default function PostsPage() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

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
        user={null} 
        role=""
        handleLogout={() => {}}
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