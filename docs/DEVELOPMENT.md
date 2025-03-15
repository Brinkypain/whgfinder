# WHG Finder - Entwicklungsdokumentation

## Projektübersicht

WHG Finder ist eine Webanwendung, die Mitarbeitern von Jugendämtern und Sozialarbeitern dabei hilft, geeignete Wohngruppen für Kinder und Jugendliche zu finden, die aus ihren Familien entnommen werden mussten. Die Anwendung bietet eine umfassende Datenbank mit Wohngruppen in ganz Deutschland und ermöglicht eine gezielte Suche nach verschiedenen Kriterien.

## Technologie-Stack

- **Frontend**: React.js mit Material UI für ein modernes, Apple-inspiriertes Design
- **Datenbank**: JSON-basierte Datenbank (für zukünftige Erweiterung: MongoDB)
- **Datensammlung**: Python-Skripte für Web-Scraping und Datengenerierung
- **Kartendarstellung**: Leaflet für interaktive Karten

## Projektstruktur

```
whgfinder/
├── README.md                 # Projektbeschreibung
├── DEPLOYMENT.md             # Anleitung zur Bereitstellung
├── frontend/                 # React-Frontend
│   ├── public/               # Öffentliche Dateien
│   │   ├── index.html        # HTML-Template
│   │   └── data/             # Daten für die Frontend-Anwendung
│   │       └── wohngruppen.json  # Wohngruppen-Daten
│   └── src/                  # React-Quellcode
│       ├── components/       # Wiederverwendbare Komponenten
│       │   ├── Header.js     # Kopfzeile
│       │   └── Footer.js     # Fußzeile
│       ├── pages/            # Seitenkomponenten
│       │   ├── HomePage.js   # Startseite
│       │   ├── SearchPage.js # Suchseite mit Filtern
│       │   ├── DetailPage.js # Detailansicht einer Wohngruppe
│       │   └── AboutPage.js  # Über uns Seite
│       ├── utils/            # Hilfsfunktionen
│       │   └── filterUtils.js # Funktionen für die Filterung
│       ├── App.js            # Hauptkomponente
│       └── index.js          # Einstiegspunkt
├── backend/                  # Für zukünftige Backend-Implementierung
├── database/                 # Datenbankskripte und -schema
│   ├── schema.md             # Datenbankschema-Dokumentation
│   ├── data/                 # Gesammelte Daten
│   │   ├── wohngruppen.json  # Wohngruppen-Daten
│   │   └── stats.json        # Statistiken zu den Daten
│   └── scripts/              # Skripte für die Datensammlung
│       └── data_collection.py # Hauptskript für die Datensammlung
└── docs/                     # Projektdokumentation
    └── DEVELOPMENT.md        # Entwicklungsdokumentation
```

## Implementierte Funktionen

### Datensammlung

- Web-Scraping von Wohngruppen-Daten von freiplatzmeldungen.de
- Generierung von Beispieldaten für die Entwicklung
- Speicherung der Daten im JSON-Format

### Frontend

- Moderne, benutzerfreundliche Oberfläche im Apple-Stil
- Responsive Design für verschiedene Geräte
- Interaktive Karte zur Visualisierung der Wohngruppen-Standorte

### Suchfunktionalität

- Suche nach Stadt oder Umkreis (mit Kilometerangabe)
- Filterung nach Aufnahmealter
- Filterung nach Art der Einrichtung (teilstationär, stationär, heilpädagogisch)
- Filterung nach Geschlecht (männlich, weiblich, gemischt)
- Filterung nach Spezialisierungen und Handicaps

## Zukünftige Erweiterungen

- Implementierung eines Backend-Servers mit Node.js und Express
- Migration zu einer MongoDB-Datenbank für bessere Skalierbarkeit
- Authentifizierung für Jugendamtsmitarbeiter
- Echtzeit-Updates zu freien Plätzen in Wohngruppen
- Kontaktformular für direkte Anfragen an Träger
- Erweiterung der Datensammlung auf weitere Quellen

## Entwicklungsschritte

1. **Projektstruktur erstellen**: Einrichtung des GitHub-Repositories und der grundlegenden Verzeichnisstruktur
2. **Datenrecherche**: Recherche von Wohngruppen in Deutschland und relevanten Filterkriterien
3. **Datenbankdesign**: Erstellung eines Schemas für die Wohngruppen-Daten
4. **Datensammlung**: Implementierung von Skripten zur Sammlung und Generierung von Wohngruppen-Daten
5. **Frontend-Entwicklung**: Erstellung der React-Komponenten und des UI-Designs
6. **Suchfunktionalität**: Implementierung der Filterlogik und der Kartenintegration
7. **Deployment**: Vorbereitung der Anwendung für die Bereitstellung

## Herausforderungen und Lösungen

- **Datensammlung**: Die Extraktion von Daten von Websites war herausfordernd. Lösung: Implementierung eines robusten Scraping-Skripts mit Fallback auf generierte Beispieldaten.
- **Umkreissuche**: Die Implementierung der Umkreissuche erforderte geografische Berechnungen. Lösung: Verwendung der Haversine-Formel zur Berechnung der Entfernung zwischen Koordinaten.
- **Filterlogik**: Die Kombination mehrerer Filter erforderte eine sorgfältige Implementierung. Lösung: Erstellung einer modularen Filterlogik in einer separaten Utility-Datei.

## Fazit

WHG Finder bietet eine benutzerfreundliche Lösung für die Suche nach geeigneten Wohngruppen für Kinder und Jugendliche in Deutschland. Die Anwendung erfüllt alle gestellten Anforderungen und bietet eine solide Grundlage für zukünftige Erweiterungen.
