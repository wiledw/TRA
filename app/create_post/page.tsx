"use client";

import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/navbar";
import ClickMap from "../components/ClickMap";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import { Box, PaletteMode, TextField, Button, Typography } from "@mui/material";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
    const router = useRouter();
    const [mode, setMode] = React.useState<PaletteMode>("light");
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const [titleInput, setTitleInput] = useState("");  // Separate state for Title
    const [descriptionInput, setDescriptionInput] = useState("");  // Separate state for Description
    const [image, setImage] = useState<File | null>(null);  // State for the uploaded image
    const [error, setError] = useState(false);
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
  

    // Create a ref to interact with the ClickMap component
    const clickMapRef = useRef<any>(null);

    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
      setMode((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const toggleCustomTheme = () => {
      setShowCustomTheme((prev) => !prev);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleInput(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionInput(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImage(file);  // Only set the first selected file
        }
    };

    const handleGetMapPoints = () => {
      if (clickMapRef.current) {
        const points = clickMapRef.current.getMapPoints(); // Access the method exposed by ClickMap
        return points;
      }
    };

    const handleSubmit = () => {
        if (!titleInput || !descriptionInput) {
            setError(true); // Show error if any field is empty
        } else {
            // Proceed with form submission or other actions
            setError(false);
            console.log("Title submitted:", titleInput);
            console.log("Description submitted:", descriptionInput);
            console.log("Image uploaded:", image);

            const points = handleGetMapPoints();
            console.log("Map locations submitted:", points);
        }
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
            paddingTop: "64px"
            //paddingX: 3,
          }}
        >
          {/* Combined Box for Title and Description */}
          <Box
            sx={{
              backgroundColor: "grey.200", // Background color for the combined box
              padding: 2, // Padding for spacing inside the box
              borderRadius: 2, // Rounded corners
              display: 'flex',
              flexDirection: 'column', // Stacks the TextFields vertically
              alignItems: 'center', // Centers the TextFields horizontally
              width: "60%", // Controls the overall width of the combined box
              marginTop: 3,
              marginLeft: 'auto', // Centers the box horizontally
              marginRight: 'auto', // Centers the box horizontally
            }}
          >
            {/* Title TextField */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={titleInput} // Use titleInput for the Title field
              onChange={handleTitleChange}
              error={error && !titleInput} // Only show error if Title is empty
              helperText={error && !titleInput ? "This field is required" : ""}
              sx={{
                marginBottom: 2, // Adds spacing between the Title and Description fields
              }}
            />

            {/* Description TextField */}
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              required
              value={descriptionInput} // Use descriptionInput for the Description field
              onChange={handleDescriptionChange}
              error={error && !descriptionInput} // Only show error if Description is empty
              helperText={error && !descriptionInput ? "This field is required" : ""}
              sx={{
                marginBottom: 2, // Adds spacing between the Description and Image fields
              }}
            />

            {/* Image Upload Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 2,
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: 2,
                width: "100%", // Same width as other fields
                border: "1px solid", // Optional border styling
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 10 }}
              />
              {image && (
                <Typography variant="body2" color="textSecondary">
                  Image selected: {image.name}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Adjust the space between ClickMap and Box */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              width: '60%',
              backgroundColor: "grey.200", // Background color for the header
              borderRadius: 2, // Rounded corners
              padding: 2, // Padding inside the header box
              marginTop: 3,
              marginBottom: -5,
              marginLeft: 'auto', // Centers the box horizontally
              marginRight: 'auto', // Centers the box horizontally
            }}
          >
            <h1>Select locations:</h1>
          </Box>

          <ClickMap ref={clickMapRef}/>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',  // Centers the button horizontally
              marginTop: 0,  // Adds some space above the button
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>

        </Box>
      </ThemeProvider>
    );
}
