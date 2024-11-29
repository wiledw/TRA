import * as React from 'react';
import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ToggleColorMode from './ToggleColorMode';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import tmuLogoImage from '../img/tmu-logo.png';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import stockProfilePic from '../img/stockProfilePic.jpg';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
  user: any;
  role: string;  // 'admin' or 'student'
  handleLogout: () => void;
}

function NavBar({ mode, user, role, handleLogout }: AppAppBarProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClientComponentClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        console.log('data', data);
        setUserData(data.session.user);
      }
    };

    fetchUserData();
  }, [supabase.auth]);

  const handlePostClick = () => {
    if (user && role === 'student') {
      router.push('/postsUser');
    } else if (user && role === 'admin') { 
      router.push('/postsAdmin');
    } else {
      router.push('/login');
    }
  };

  const handleCreatePostClick = () => {
    router.push('/create_post');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    handleLogout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            bgcolor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.4)'
                : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
          })}
        >
          <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 1,
              }}
            >
            {/*logoImage*/}
            <Image
                src={tmuLogoImage}
                width={45}
                height={45}
                alt="logo of website"
                className="mr-2"
            />   
            {/* Home Link */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {user && (
                <MenuItem onClick={handlePostClick}>
                  <Typography variant="body2" color="text.primary">
                    Post
                  </Typography>
                </MenuItem>
              )}

              {user && (
                <MenuItem onClick={handleCreatePostClick}>
                  <Typography variant="body2" color="text.primary">
                    Create Post
                  </Typography>
                </MenuItem>
              )}
            </Box>

      

            {/* Replace the user profile and sign out button section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              {user && userData ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Image
                      src={userData.user_metadata?.avatar_url || stockProfilePic.src}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </IconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={handleSignOut}>
                      <Typography variant="body2">Sign out</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
