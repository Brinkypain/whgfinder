import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

const Header = () => {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              WHG Finder
            </RouterLink>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              component={RouterLink} 
              to="/" 
              startIcon={<HomeIcon />}
              sx={{ textTransform: 'none' }}
            >
              Startseite
            </Button>
            <Button 
              component={RouterLink} 
              to="/search" 
              startIcon={<SearchIcon />}
              sx={{ textTransform: 'none' }}
            >
              Suche
            </Button>
            <Button 
              component={RouterLink} 
              to="/about" 
              startIcon={<InfoIcon />}
              sx={{ textTransform: 'none' }}
            >
              Über uns
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
