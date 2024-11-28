"use client";

import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/navbar";
import ClickMap from "../components/ClickMap";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import { Box, PaletteMode, TextField, Button, Typography } from "@mui/material";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Image from 'next/image';

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

    const handleSubmit = async () => {
        if (!titleInput || !descriptionInput) {
            setError(true); // Show error if any field is empty
        } else {
            setError(false);
            console.log("Title submitted:", titleInput);
            console.log("Description submitted:", descriptionInput);
            console.log("Image uploaded:", image);

            const points = handleGetMapPoints();
            console.log("Map locations submitted:", points);
            const labels = points.map((point: { label: string }) => point.label);
            console.log("Extracted labels:", labels);

            // Prepare the data to be sent
            const postData = {
                title: titleInput,
                description: descriptionInput,
                image: "", // Placeholder for the image URL
                locations: labels,
                created_by: user.id,
            };

            try {
                // Upload the image to Supabase Storage
                if (image) {
                    const { data, error: uploadError } = await supabase.storage
                        .from('postImage')
                        .upload(`public/${image.name}`, image, {
                            cacheControl: '3600',
                            upsert: false,
                        });

                    if (uploadError) {
                        throw uploadError;
                    }

                    // Get the public URL of the uploaded image
                    const { data : { publicUrl } } = supabase.storage
                        .from('postImage')
                        .getPublicUrl(`public/${image.name}`);

                    // Update postData with the image URL
                    postData.image = publicUrl;
                }

                // Send the post data to the API
                const response = await fetch('/api/user/createPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("Post created successfully:", data);
                toast.success("Post created successfully!"); // Show success toast
                router.push('/postsUser'); // Redirect to /postsUser
            } catch (error) {
                console.error('Error creating post:', error);
                toast.error('Error creating post. Please try again.'); // Show error toast
            }
        }
    };

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
            bgcolor: "background.default",
            color: "text.primary",
            minHeight: "100vh",
            paddingTop: "64px",
            paddingX: 3,
          }}
        >
          {/* Combined Box for Title and Description */}
          <Box
            sx={{
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: "80%",
              marginTop: 3,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {/* Title TextField */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={titleInput}
              onChange={handleTitleChange}
              error={error && !titleInput}
              helperText={error && !titleInput ? "This field is required" : ""}
              sx={{
                marginBottom: 2,
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />

            {/* Description TextField */}
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              required
              value={descriptionInput}
              onChange={handleDescriptionChange}
              error={error && !descriptionInput}
              helperText={error && !descriptionInput ? "This field is required" : ""}
              sx={{
                marginBottom: 2,
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />

            {/* Image Upload Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 2,
                backgroundColor: "white",
                padding: 2,
                borderRadius: 2,
                width: "100%",
                border: "1px solid",
                borderColor: "grey.300",
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
              paddingBottom: 10,
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 3 }}>
              Submit
            </Button>
          </Box>

        </Box>
      </ThemeProvider>
    );
}
