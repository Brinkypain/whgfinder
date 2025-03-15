import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          WHG Finder
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Finden Sie die passende Wohngruppe für Kinder und Jugendliche in Deutschland
        </Typography>
        
        <Box sx={{ mt: 6, mb: 8 }}>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<SearchIcon />}
            onClick={() => navigate('/search')}
            sx={{ mr: 2, py: 1.5, px: 4 }}
          >
            Suche starten
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<InfoIcon />}
            onClick={() => navigate('/about')}
            sx={{ py: 1.5, px: 4 }}
          >
            Über uns
          </Button>
        </Box>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(33, 150, 243, 0.05)' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Umfassende Datenbank
              </Typography>
              <Typography variant="body1">
                Unsere Datenbank enthält Wohngruppen aus ganz Deutschland, sowohl von öffentlichen als auch privaten Trägern.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(76, 175, 80, 0.05)' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Präzise Filteroptionen
              </Typography>
              <Typography variant="body1">
                Filtern Sie nach Stadt, Umkreis, Alter, Art der Einrichtung, Geschlecht und speziellen Anforderungen.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Für Fachkräfte optimiert
              </Typography>
              <Typography variant="body1">
                Speziell entwickelt für Mitarbeiter von Jugendämtern und Sozialarbeiter, die nach SGB8-konformen Einrichtungen suchen.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
