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

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
  user: any;
  handleLogout: () => void;
}

function NavBar({ mode, toggleColorMode, user, handleLogout }: AppAppBarProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleProfileClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
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
              <MenuItem onClick={handleHomeClick}>
                <Typography variant="body2" color="text.primary">
                  Home
                </Typography>
              </MenuItem>

              {user && (
                <MenuItem onClick={handleProfileClick}>
                  <Typography variant="body2" color="text.primary">
                    Profile
                  </Typography>
                </MenuItem>
              )}
            </Box>

            {/* Toggle Color Mode */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />

              {user ? (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
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
