import React from 'react';

// Hilfsfunktion zur Berechnung der Entfernung zwischen zwei Koordinaten (Haversine-Formel)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Erdradius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Entfernung in km
  return distance;
};

// Hilfsfunktion zum Filtern der Wohngruppen basierend auf den Filterkriterien
export const filterWohngruppen = (wohngruppen, filters) => {
  let result = [...wohngruppen];
  
  // Stadt-Filter
  if (filters.stadt && filters.stadt.trim() !== '') {
    // Wenn Koordinaten für die Stadt vorhanden sind und ein Umkreis definiert ist
    if (filters.stadtKoordinaten && filters.umkreis > 0) {
      result = result.filter(wg => {
        if (wg.adresse && wg.adresse.koordinaten) {
          const distance = calculateDistance(
            filters.stadtKoordinaten.lat,
            filters.stadtKoordinaten.lng,
            wg.adresse.koordinaten.lat,
            wg.adresse.koordinaten.lng
          );
          return distance <= filters.umkreis;
        }
        return false;
      });
    } else {
      // Einfache Textsuche, wenn keine Koordinaten verfügbar sind
      result = result.filter(wg => 
        wg.adresse && 
        wg.adresse.ort && 
        wg.adresse.ort.toLowerCase().includes(filters.stadt.toLowerCase())
      );
    }
  }
  
  // Altersbereich-Filter
  if (filters.minAlter > 0 || filters.maxAlter < 27) {
    result = result.filter(wg => 
      wg.altersbereich && 
      wg.altersbereich.min <= filters.maxAlter && 
      wg.altersbereich.max >= filters.minAlter
    );
  }
  
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
  
  return result;
};

// Hilfsfunktion zum Extrahieren einzigartiger Werte für Filter-Dropdowns
export const extractFilterOptions = (wohngruppen) => {
  if (!wohngruppen || wohngruppen.length === 0) {
    return {
      arten: [],
      spezialisierungen: [],
      handicaps: [],
      bundeslaender: []
    };
  }
  
  const arten = [...new Set(wohngruppen.flatMap(wg => wg.art || []))];
  const spezialisierungen = [...new Set(wohngruppen.flatMap(wg => wg.spezialisierungen || []))];
  const handicaps = [...new Set(wohngruppen.flatMap(wg => wg.handicaps || []))];
  const bundeslaender = [...new Set(wohngruppen
    .filter(wg => wg.adresse && wg.adresse.bundesland)
    .map(wg => wg.adresse.bundesland)
  )];
  
  return {
    arten,
    spezialisierungen,
    handicaps,
    bundeslaender
  };
};
