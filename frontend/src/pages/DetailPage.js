import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const DetailPage = ({ wohngruppen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const wohngruppe = wohngruppen[parseInt(id)];
  
  if (!wohngruppe) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Wohngruppe nicht gefunden
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/search')}
            sx={{ mt: 2 }}
          >
            Zurück zur Suche
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/search')}
        sx={{ mb: 3 }}
      >
        Zurück zur Suche
      </Button>
      
      <Typography variant="h3" component="h1" gutterBottom>
        {wohngruppe.name}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Träger: {wohngruppe.traeger.name}
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          {/* Hauptinformationen */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Übersicht
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Art der Einrichtung:</strong> {wohngruppe.art && wohngruppe.art.join(', ')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Geschlecht:</strong> {wohngruppe.geschlecht}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Altersbereich:</strong> {wohngruppe.altersbereich.min}-{wohngruppe.altersbereich.max} Jahre
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Plätze:</strong> {wohngruppe.platzzahl && wohngruppe.platzzahl.gesamt}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="h6" component="h3" gutterBottom>
              Rechtliche Grundlagen
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {wohngruppe.paragraphen && wohngruppe.paragraphen.map((p, i) => (
                <Chip key={i} label={p} color="primary" />
              ))}
            </Box>
            
            {wohngruppe.beschreibung && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Beschreibung
                </Typography>
                <Typography variant="body1" paragraph>
                  {wohngruppe.beschreibung}
                </Typography>
              </>
            )}
            
            {wohngruppe.spezialisierungen && wohngruppe.spezialisierungen.length > 0 && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Spezialisierungen
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {wohngruppe.spezialisierungen.map((spez, i) => (
                    <Chip key={i} label={spez} color="secondary" />
                  ))}
                </Box>
              </>
            )}
            
            {wohngruppe.handicaps && wohngruppe.handicaps.length > 0 && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Unterstützte Handicaps
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {wohngruppe.handicaps.map((handicap, i) => (
                    <Chip key={i} label={handicap} variant="outlined" />
                  ))}
                </Box>
              </>
            )}
          </Paper>
          
          {/* Karte */}
          {wohngruppe.adresse && wohngruppe.adresse.koordinaten && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Standort
              </Typography>
              
              <Box sx={{ height: '400px' }}>
                <MapContainer 
                  center={[wohngruppe.adresse.koordinaten.lat, wohngruppe.adresse.koordinaten.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker 
                    position={[wohngruppe.adresse.koordinaten.lat, wohngruppe.adresse.koordinaten.lng]}
                  >
                    <Popup>
                      <Typography variant="subtitle1">{wohngruppe.name}</Typography>
                      <Typography variant="body2">
                        {wohngruppe.adresse.strasse && `${wohngruppe.adresse.strasse}, `}
                        {wohngruppe.adresse.plz && `${wohngruppe.adresse.plz} `}
                        {wohngruppe.adresse.ort}
                      </Typography>
                    </Popup>
                  </Marker>
                </MapContainer>
              </Box>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Kontaktinformationen */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Kontakt
              </Typography>
              
              <List>
                {wohngruppe.adresse && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Adresse" 
                      secondary={
                        <>
                          {wohngruppe.adresse.strasse && `${wohngruppe.adresse.strasse}`}<br />
                          {wohngruppe.adresse.plz && `${wohngruppe.adresse.plz} `}
                          {wohngruppe.adresse.ort}<br />
                          {wohngruppe.adresse.bundesland}
                        </>
                      } 
                    />
                  </ListItem>
                )}
                
                {wohngruppe.traeger && wohngruppe.traeger.kontakt && (
                  <>
                    {wohngruppe.traeger.kontakt.ansprechpartner && (
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Ansprechpartner" 
                          secondary={wohngruppe.traeger.kontakt.ansprechpartner} 
                        />
                      </ListItem>
                    )}
                    
                    {wohngruppe.traeger.kontakt.telefon && (
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Telefon" 
                          secondary={wohngruppe.traeger.kontakt.telefon} 
                        />
                      </ListItem>
                    )}
                    
                    {wohngruppe.traeger.kontakt.email && (
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="E-Mail" 
                          secondary={wohngruppe.traeger.kontakt.email} 
                        />
                      </ListItem>
                    )}
                    
                    {wohngruppe.traeger.kontakt.website && (
                      <ListItem>
                        <ListItemIcon>
                          <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Website" 
                          secondary={
                            <a href={wohngruppe.traeger.kontakt.website} target="_blank" rel="noopener noreferrer">
                              {wohngruppe.traeger.kontakt.website}
                            </a>
                          } 
                        />
                      </ListItem>
                    )}
                  </>
                )}
              </List>
            </CardContent>
          </Card>
          
          {/* Trägerinformationen */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Trägerinformationen
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {wohngruppe.traeger.name}
              </Typography>
              
              {wohngruppe.traeger.typ && (
                <Typography variant="body1" gutterBottom>
                  <strong>Typ:</strong> {wohngruppe.traeger.typ}
                </Typography>
              )}
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => {
                  // Hier könnte eine Anfrage an den Träger implementiert werden
                  alert('Anfrage-Funktion wird in einer späteren Version implementiert.');
                }}
              >
                Anfrage senden
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailPage;
