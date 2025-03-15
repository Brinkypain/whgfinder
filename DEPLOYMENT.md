# Deployment-Anleitung für WHG Finder

Diese Anleitung beschreibt, wie Sie den WHG Finder lokal ausführen und für die Produktion bereitstellen können.

## Lokale Entwicklung

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (Version 6 oder höher)
- Git

### Installation

1. Klonen Sie das Repository:
   ```
   git clone https://github.com/brinkypain/whgfinder.git
   cd whgfinder
   ```

2. Installieren Sie die Abhängigkeiten:
   ```
   npm install
   cd frontend
   npm install
   ```

3. Starten Sie die Entwicklungsumgebung:
   ```
   cd frontend
   npm start
   ```

4. Die Anwendung ist nun unter http://localhost:3000 verfügbar.

## Datensammlung

Um die Datenbank mit Wohngruppen zu aktualisieren:

1. Führen Sie das Datensammlungsskript aus:
   ```
   cd whgfinder
   python3 database/scripts/data_collection.py
   ```

2. Die gesammelten Daten werden in `database/data/wohngruppen.json` gespeichert.

3. Kopieren Sie die Daten in das Frontend-Verzeichnis:
   ```
   mkdir -p frontend/public/data
   cp database/data/wohngruppen.json frontend/public/data/
   ```

## Produktions-Deployment

### Statisches Deployment (GitHub Pages, Vercel, Netlify)

1. Erstellen Sie einen Produktions-Build:
   ```
   cd frontend
   npm run build
   ```

2. Der Build wird im Verzeichnis `frontend/build` erstellt.

3. Für GitHub Pages:
   ```
   npm install -g gh-pages
   gh-pages -d build
   ```

4. Für Vercel oder Netlify können Sie die entsprechenden CLI-Tools verwenden oder die Plattformen direkt mit Ihrem GitHub-Repository verbinden.

### Docker-Deployment

1. Erstellen Sie ein Docker-Image:
   ```
   docker build -t whgfinder .
   ```

2. Starten Sie einen Container:
   ```
   docker run -p 80:80 whgfinder
   ```

3. Die Anwendung ist nun unter http://localhost verfügbar.

## Umgebungsvariablen

Die Anwendung unterstützt folgende Umgebungsvariablen:

- `REACT_APP_API_URL`: URL der API (falls in Zukunft eine separate Backend-API implementiert wird)
- `REACT_APP_MAPBOX_TOKEN`: Mapbox-Token für erweiterte Kartenfunktionen (optional)

## Weitere Informationen

Weitere Informationen zur Anwendung finden Sie in der [Dokumentation](./docs/DEVELOPMENT.md).
