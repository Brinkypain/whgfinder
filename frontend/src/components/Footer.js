import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f7' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} WHG Finder | Alle Rechte vorbehalten
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="/about">
            Über uns
          </Link>{' | '}
          <Link color="inherit" href="#">
            Datenschutz
          </Link>{' | '}
          <Link color="inherit" href="#">
            Impressum
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
