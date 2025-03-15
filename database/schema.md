# Datenbankschema für WHG Finder

Basierend auf der Recherche von Wohngruppen-Daten und den Anforderungen für die Filterfunktionen wird folgendes Datenbankschema vorgeschlagen:

## Sammlung: Wohngruppen

```javascript
{
  "_id": ObjectId,                // Eindeutige ID der Wohngruppe
  "name": String,                 // Name der Wohngruppe
  "traeger": {                    // Informationen zum Träger
    "name": String,               // Name des Trägers
    "typ": String,                // z.B. "öffentlich", "privat", "kirchlich"
    "kontakt": {
      "ansprechpartner": String,  // Name des Ansprechpartners
      "telefon": String,          // Telefonnummer
      "email": String,            // E-Mail-Adresse
      "website": String           // Website des Trägers
    }
  },
  "adresse": {                    // Standort der Wohngruppe
    "strasse": String,            // Straße und Hausnummer
    "plz": String,                // Postleitzahl
    "ort": String,                // Ort
    "bundesland": String,         // Bundesland
    "koordinaten": {              // Geografische Koordinaten für Umkreissuche
      "lat": Number,              // Breitengrad
      "lng": Number               // Längengrad
    }
  },
  "art": [String],                // Art der Einrichtung: "teilstationär", "stationär", "heilpädagogisch"
  "paragraphen": [String],        // Rechtliche Grundlagen: "§34", "§35", "§35a", "§41" usw.
  "altersbereich": {              // Altersbereich für Aufnahme
    "min": Number,                // Minimales Aufnahmealter
    "max": Number                 // Maximales Aufnahmealter
  },
  "geschlecht": String,           // "männlich", "weiblich", "gemischt"
  "platzzahl": {                  // Anzahl der Plätze
    "gesamt": Number,             // Gesamtanzahl der Plätze
    "belegt": Number              // Anzahl der belegten Plätze (optional für spätere Erweiterung)
  },
  "spezialisierungen": [String],  // Spezialisierungen der Wohngruppe
  "handicaps": [String],          // Unterstützte Handicaps nach §35 und §34a SGB8
  "beschreibung": String,         // Beschreibung der Wohngruppe
  "besonderheiten": [String],     // Besonderheiten der Wohngruppe
  "updated_at": Date              // Datum der letzten Aktualisierung
}
```

## Sammlung: Bundeslaender

```javascript
{
  "_id": ObjectId,                // Eindeutige ID des Bundeslandes
  "name": String,                 // Name des Bundeslandes
  "kuerzel": String               // Kürzel des Bundeslandes (z.B. "BW" für Baden-Württemberg)
}
```

## Sammlung: Staedte

```javascript
{
  "_id": ObjectId,                // Eindeutige ID der Stadt
  "name": String,                 // Name der Stadt
  "plz": [String],                // Liste der Postleitzahlen in der Stadt
  "bundesland": String,           // Zugehöriges Bundesland
  "koordinaten": {                // Geografische Koordinaten für Umkreissuche
    "lat": Number,                // Breitengrad
    "lng": Number                 // Längengrad
  }
}
```

## Sammlung: Spezialisierungen

```javascript
{
  "_id": ObjectId,                // Eindeutige ID der Spezialisierung
  "name": String,                 // Name der Spezialisierung
  "kategorie": String,            // Kategorie der Spezialisierung
  "beschreibung": String          // Beschreibung der Spezialisierung
}
```

## Sammlung: Handicaps

```javascript
{
  "_id": ObjectId,                // Eindeutige ID des Handicaps
  "name": String,                 // Name des Handicaps
  "paragraphen": [String],        // Zugehörige Paragraphen (§35, §34a)
  "beschreibung": String          // Beschreibung des Handicaps
}
```

Dieses Schema ermöglicht alle geforderten Filterfunktionen:
- Suche nach Stadt oder Umkreis (mit Koordinaten)
- Filterung nach Aufnahmealter
- Filterung nach Art der Einrichtung
- Filterung nach Geschlecht
- Filterung nach Spezialisierungen und Handicaps

Die Datenbank wird in MongoDB implementiert, da diese Dokumentendatenbank flexible Schemas und gute Abfragemöglichkeiten bietet.
