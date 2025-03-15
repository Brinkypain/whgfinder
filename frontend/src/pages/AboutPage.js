import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Über WHG Finder
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Unsere Mission
        </Typography>
        <Typography variant="body1" paragraph>
          WHG Finder wurde entwickelt, um Mitarbeitern von Jugendämtern und Sozialarbeitern dabei zu helfen, 
          schnell und effizient passende Wohngruppen für Kinder und Jugendliche zu finden, die aus ihren 
          Familien entnommen werden mussten. Unsere Plattform bietet eine umfassende Datenbank mit Wohngruppen 
          in ganz Deutschland und ermöglicht eine gezielte Suche nach verschiedenen Kriterien.
        </Typography>
        <Typography variant="body1" paragraph>
          Wir verstehen, dass die Suche nach einer geeigneten Wohngruppe oft zeitaufwändig und komplex ist. 
          Mit WHG Finder möchten wir diesen Prozess vereinfachen und beschleunigen, damit Kinder und Jugendliche 
          schneller in einer passenden Umgebung untergebracht werden können.
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Funktionen
            </Typography>
            <Typography variant="body1" paragraph>
              WHG Finder bietet folgende Funktionen:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  Suche nach Wohngruppen in einer bestimmten Stadt oder im Umkreis (mit Kilometerangabe)
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Filterung nach Aufnahmealter
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Filterung nach Art der Einrichtung (teilstationär, stationär, heilpädagogisch)
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Filterung nach Geschlecht (auch gemischt)
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Filterung nach Spezialisierungen auf bestimmte Krankheiten und Handicaps (nach §35 und §34a SGB8)
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Rechtliche Grundlagen
            </Typography>
            <Typography variant="body1" paragraph>
              Die auf WHG Finder gelisteten Wohngruppen arbeiten nach den Vorgaben des SGB VIII (Sozialgesetzbuch Achtes Buch - Kinder- und Jugendhilfe). 
              Besonders relevant sind dabei folgende Paragraphen:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>§ 34 SGB VIII:</strong> Heimerziehung, sonstige betreute Wohnform
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>§ 35 SGB VIII:</strong> Intensive sozialpädagogische Einzelbetreuung
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>§ 35a SGB VIII:</strong> Eingliederungshilfe für seelisch behinderte Kinder und Jugendliche
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>§ 41 SGB VIII:</strong> Hilfe für junge Volljährige
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Kontakt
        </Typography>
        <Typography variant="body1" paragraph>
          Bei Fragen, Anregungen oder Feedback zu WHG Finder können Sie uns gerne kontaktieren:
        </Typography>
        <Typography variant="body1">
          E-Mail: kontakt@whgfinder.de
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutPage;
