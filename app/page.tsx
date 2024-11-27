"use client"

import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import tmuImage from '../app/img/TMUCampus.png';

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <Image
        src={tmuImage}
        alt="Toronto Metropolitan University"
        fill
        style={{ 
          objectFit: 'cover',
          zIndex: -1
        }}
        priority
      />

      {/* Full Page Overlay */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0
      }}>
        {/* Content */}
        <Container sx={{ 
          height: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ 
              mb: 2, 
              fontWeight: 'bold', 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Welcome to TRA
            </Typography>
            <Typography variant="h5" sx={{ 
              mb: 4, 
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              Toronto Metropolitan University Safe Portal
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/login')}
              sx={{ 
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.2rem',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Login to Continue
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
