import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Button,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const SearchPage = ({ wohngruppen }) => {
  const [filteredWohngruppen, setFilteredWohngruppen] = useState([]);
  const [filters, setFilters] = useState({
    stadt: '',
    umkreis: 50,
    minAlter: 0,
    maxAlter: 27,
    art: [],
    geschlecht: '',
    spezialisierungen: [],
    handicaps: []
  });
  
  const [showFilters, setShowFilters] = useState(true);
  
  // Einzigartige Werte für Filter-Dropdowns extrahieren
  const [filterOptions, setFilterOptions] = useState({
    arten: [],
    spezialisierungen: [],
    handicaps: []
  });
  
  useEffect(() => {
    if (wohngruppen && wohngruppen.length > 0) {
      // Einzigartige Werte für Filter-Dropdowns extrahieren
      const arten = [...new Set(wohngruppen.flatMap(wg => wg.art || []))];
      const spezialisierungen = [...new Set(wohngruppen.flatMap(wg => wg.spezialisierungen || []))];
      const handicaps = [...new Set(wohngruppen.flatMap(wg => wg.handicaps || []))];
      
      setFilterOptions({
        arten,
        spezialisierungen,
        handicaps
      });
      
      // Initial alle Wohngruppen anzeigen
      setFilteredWohngruppen(wohngruppen);
    }
  }, [wohngruppen]);
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: typeof value === 'string' ? value.split(',') : value
    });
  };
  
  const handleSliderChange = (name) => (event, newValue) => {
    setFilters({
      ...filters,
      [name]: newValue
    });
  };
  
  const applyFilters = () => {
    let result = [...wohngruppen];
    
    // Stadt-Filter
    if (filters.stadt) {
      result = result.filter(wg => 
        wg.adresse && 
        wg.adresse.ort && 
        wg.adresse.ort.toLowerCase().includes(filters.stadt.toLowerCase())
      );
    }
    
    // Altersbereich-Filter
    result = result.filter(wg => 
      wg.altersbereich && 
      wg.altersbereich.min <= filters.maxAlter && 
      wg.altersbereich.max >= filters.minAlter
    );
    
    // Art der Einrichtung
    if (filters.art && filters.art.length > 0) {
      result = result.filter(wg => 
        wg.art && 
        filters.art.some(art => wg.art.includes(art))
      );
    }
    
    // Geschlecht
    if (filters.geschlecht) {
      result = result.filter(wg => 
        wg.geschlecht === filters.geschlecht || 
        wg.geschlecht === 'gemischt'
      );
    }
    
    // Spezialisierungen
    if (filters.spezialisierungen && filters.spezialisierungen.length > 0) {
      result = result.filter(wg => 
        wg.spezialisierungen && 
        filters.spezialisierungen.some(spez => wg.spezialisierungen.includes(spez))
      );
    }
    
    // Handicaps
    if (filters.handicaps && filters.handicaps.length > 0) {
      result = result.filter(wg => 
        wg.handicaps && 
        filters.handicaps.some(handicap => wg.handicaps.includes(handicap))
      );
    }
    
    setFilteredWohngruppen(result);
  };
  
  const resetFilters = () => {
    setFilters({
      stadt: '',
      umkreis: 50,
      minAlter: 0,
      maxAlter: 27,
      art: [],
      geschlecht: '',
      spezialisierungen: [],
      handicaps: []
    });
    setFilteredWohngruppen(wohngruppen);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Wohngruppen suchen
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filter-Bereich */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Filter
              </Typography>
              <Button 
                size="small" 
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ausblenden' : 'Einblenden'}
              </Button>
            </Box>
            
            {showFilters && (
              <Box>
                <TextField
                  fullWidth
                  label="Stadt"
                  name="stadt"
                  value={filters.stadt}
                  onChange={handleFilterChange}
                  margin="normal"
                  variant="outlined"
                  size="small"
                />
                
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography gutterBottom>
                    Umkreis: {filters.umkreis} km
                  </Typography>
                  <Slider
                    value={filters.umkreis}
                    onChange={handleSliderChange('umkreis')}
                    min={0}
                    max={200}
                    step={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography gutterBottom>
                    Alter: {filters.minAlter} - {filters.maxAlter} Jahre
                  </Typography>
                  <Slider
                    value={[filters.minAlter, filters.maxAlter]}
                    onChange={(e, newValue) => {
                      setFilters({
                        ...filters,
                        minAlter: newValue[0],
                        maxAlter: newValue[1]
                      });
                    }}
                    min={0}
                    max={27}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Art der Einrichtung</InputLabel>
                  <Select
                    multiple
                    name="art"
                    value={filters.art}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {filterOptions.arten.map((art) => (
                      <MenuItem key={art} value={art}>
                        {art}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Geschlecht</InputLabel>
                  <Select
                    name="geschlecht"
                    value={filters.geschlecht}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="männlich">Männlich</MenuItem>
                    <MenuItem value="weiblich">Weiblich</MenuItem>
                    <MenuItem value="gemischt">Gemischt</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Spezialisierungen</InputLabel>
                  <Select
                    multiple
                    name="spezialisierungen"
                    value={filters.spezialisierungen}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {filterOptions.spezialisierungen.map((spez) => (
                      <MenuItem key={spez} value={spez}>
                        {spez}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Handicaps</InputLabel>
                  <Select
                    multiple
                    name="handicaps"
                    value={filters.handicaps}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {filterOptions.handicaps.map((handicap) => (
                      <MenuItem key={handicap} value={handicap}>
                        {handicap}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={resetFilters}
                  >
                    Zurücksetzen
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<SearchIcon />}
                    onClick={applyFilters}
                  >
                    Suchen
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Ergebnisbereich */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {filteredWohngruppen.length} Wohngruppen gefunden
            </Typography>
            
            {/* Karte */}
            <Box sx={{ height: '400px', mb: 3 }}>
              <MapContainer 
                center={[51.1657, 10.4515]} 
                zoom={6} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredWohngruppen.map((wg, index) => (
                  wg.adresse && wg.adresse.koordinaten && (
                    <Marker 
                      key={index} 
                      position={[wg.adresse.koordinaten.lat, wg.adresse.koordinaten.lng]}
                    >
                      <Popup>
                        <Typography variant="subtitle1">{wg.name}</Typography>
                        <Typography variant="body2">
                          {wg.adresse.ort}, {wg.adresse.bundesland}
                        </Typography>
                        <Typography variant="body2">
                          Alter: {wg.altersbereich.min}-{wg.altersbereich.max} Jahre
                        </Typography>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </Box>
            
            {/* Ergebnisliste */}
            <Grid container spacing={2}>
              {filteredWohngruppen.map((wg, index) => (
                <Grid item xs={12} key={index}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" component="h3">
                          {wg.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Träger: {wg.traeger.name}
                        </Typography>
                        
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            <strong>Standort:</strong> {wg.adresse.ort}
                            {wg.adresse.bundesland && `, ${wg.adresse.bundesland}`}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Alter:</strong> {wg.altersbereich.min}-{wg.altersbereich.max} Jahre
                          </Typography>
                          <Typography variant="body2">
                            <strong>Art:</strong> {wg.art && wg.art.join(', ')}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Geschlecht:</strong> {wg.geschlecht}
                          </Typography>
                        </Box>
                        
                        {wg.spezialisierungen && wg.spezialisierungen.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Spezialisierungen:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {wg.spezialisierungen.map((spez, i) => (
                                <Chip key={i} label={spez} size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          {wg.paragraphen && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {wg.paragraphen.map((p, i) => (
                                <Chip key={i} label={p} size="small" color="primary" variant="outlined" />
                              ))}
                            </Box>
                          )}
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          fullWidth
                          href={`/detail/${index}`}
                          sx={{ mt: 'auto' }}
                        >
                          Details anzeigen
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
