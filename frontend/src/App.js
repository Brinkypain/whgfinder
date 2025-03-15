import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import axios from 'axios';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import AboutPage from './pages/AboutPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Lade die Wohngruppen-Daten aus der JSON-Datei
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/wohngruppen.json');
        setData(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage wohngruppen={data} loading={loading} />} />
          <Route path="/detail/:id" element={<DetailPage wohngruppen={data} loading={loading} />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
