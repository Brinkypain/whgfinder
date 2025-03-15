import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

# Konfiguration
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__)) + "/../data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Geocoder für Adressumwandlung in Koordinaten
geolocator = Nominatim(user_agent="whgfinder")

def get_coordinates(address):
    """Konvertiert eine Adresse in Koordinaten"""
    try:
        location = geolocator.geocode(address)
        if location:
            return {"lat": location.latitude, "lng": location.longitude}
        return None
    except (GeocoderTimedOut, GeocoderServiceError):
        time.sleep(1)
        return get_coordinates(address)

def scrape_freiplatzmeldungen():
    """Scrape Daten von freiplatzmeldungen.de"""
    base_url = "https://freiplatzmeldungen.de"
    traeger_list_url = f"{base_url}/teilnehmende-einrichtungen/all.html"
    
    print(f"Rufe URL ab: {traeger_list_url}")
    # Liste der Träger abrufen
    response = requests.get(traeger_list_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Alle Links zu Trägerseiten finden
    traeger_links = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if href and 'aktuell/id-' in href:
            full_url = f"{base_url}/{href}" if not href.startswith('http') else href
            if full_url not in traeger_links:
                traeger_links.append(full_url)
    
    print(f"Gefunden: {len(traeger_links)} Träger-Links")
    
    # Daten für jeden Träger sammeln
    wohngruppen = []
    for i, link in enumerate(traeger_links[:20]):  # Limit für Tests
        try:
            print(f"Verarbeite Träger {i+1}/{len(traeger_links[:20])}: {link}")
            response = requests.get(link)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Träger-Informationen extrahieren
            traeger_name = None
            h2_tags = soup.find_all('h2')
            for h2 in h2_tags:
                if h2.parent.name != 'section' or 'project' not in h2.parent.get('class', []):
                    traeger_name = h2.text.strip()
                    break
            
            if not traeger_name:
                traeger_name = "Unbekannter Träger"
            
            print(f"  Träger: {traeger_name}")
            
            # Kontaktinformationen
            kontakt = {}
            contact_items = soup.select('.contact__item')
            for item in contact_items:
                label = item.select_one('.contact__label')
                value = item.select_one('.contact__value')
                if label and value:
                    key = label.text.strip().lower().replace(' ', '_')
                    kontakt[key] = value.text.strip()
            
            # Adresse extrahieren
            adresse = {}
            for key in ['strasse_und_hausnummer', 'postleitzahl,_ort']:
                if key in kontakt:
                    if key == 'strasse_und_hausnummer':
                        adresse['strasse'] = kontakt[key]
                    elif key == 'postleitzahl,_ort':
                        parts = kontakt[key].split()
                        if parts:
                            adresse['plz'] = parts[0]
                            adresse['ort'] = ' '.join(parts[1:])
            
            # Wohngruppen des Trägers finden
            wohngruppen_sections = soup.select('section.project')
            print(f"  Gefundene Wohngruppen-Sektionen: {len(wohngruppen_sections)}")
            
            for wg_section in wohngruppen_sections:
                try:
                    wg = {
                        "traeger": {
                            "name": traeger_name,
                            "kontakt": kontakt
                        },
                        "adresse": adresse.copy() if adresse else {}
                    }
                    
                    # Name der Wohngruppe
                    wg_name = wg_section.select_one('h2')
                    if wg_name:
                        wg["name"] = wg_name.text.strip()
                        print(f"    Wohngruppe: {wg['name']}")
                    
                    # Details der Wohngruppe
                    details = wg_section.select('.project__item')
                    for detail in details:
                        label = detail.select_one('.project__label')
                        value = detail.select_one('.project__value')
                        if label and value:
                            key = label.text.strip().lower().replace(' ', '_')
                            
                            # Spezielle Behandlung für bestimmte Felder
                            if key == "hilfeform":
                                paragraphen = []
                                for p in value.text.strip().split('\n'):
                                    p = p.strip()
                                    if '§' in p:
                                        paragraf = re.search(r'§\s*(\d+\w*)', p)
                                        if paragraf:
                                            paragraphen.append(f"§{paragraf.group(1)}")
                                wg["paragraphen"] = paragraphen
                                
                                # Art der Einrichtung bestimmen
                                art = []
                                text = value.text.lower()
                                if "stationär" in text or "heim" in text or "wohngruppe" in text:
                                    art.append("stationär")
                                if "teilstationär" in text or "tagesgruppe" in text:
                                    art.append("teilstationär")
                                if "heilpädagogisch" in text:
                                    art.append("heilpädagogisch")
                                if art:
                                    wg["art"] = art
                            
                            elif key == "alter":
                                # Altersbereich extrahieren
                                alter_text = value.text.strip()
                                alter_match = re.search(r'(\d+)\s*-\s*(\d+)', alter_text)
                                if alter_match:
                                    wg["altersbereich"] = {
                                        "min": int(alter_match.group(1)),
                                        "max": int(alter_match.group(2))
                                    }
                            
                            elif key == "zielgruppe":
                                # Geschlecht bestimmen
                                text = value.text.lower()
                                if "jungen" in text or "männer" in text or "männlich" in text:
                                    wg["geschlecht"] = "männlich"
                                elif "mädchen" in text or "frauen" in text or "weiblich" in text:
                                    wg["geschlecht"] = "weiblich"
                                else:
                                    wg["geschlecht"] = "gemischt"
                            
                            elif key == "standort":
                                # Ort und Bundesland
                                wg["adresse"]["ort"] = value.text.strip()
                                
                                # Versuche Koordinaten zu bekommen
                                if "ort" in wg["adresse"]:
                                    address_str = f"{wg['adresse']['ort']}, Deutschland"
                                    if "plz" in wg["adresse"]:
                                        address_str = f"{wg['adresse']['plz']} {address_str}"
                                    if "strasse" in wg["adresse"]:
                                        address_str = f"{wg['adresse']['strasse']}, {address_str}"
                                    
                                    coords = get_coordinates(address_str)
                                    if coords:
                                        wg["adresse"]["koordinaten"] = coords
                            
                            elif key == "projektausrichtung":
                                # Spezialisierungen extrahieren
                                spezialisierungen = [s.strip() for s in value.text.strip().split(',')]
                                wg["spezialisierungen"] = spezialisierungen
                            
                            else:
                                wg[key] = value.text.strip()
                    
                    # Nur Wohngruppen hinzufügen, die relevante Daten haben
                    if "name" in wg and ("paragraphen" in wg or "art" in wg):
                        wohngruppen.append(wg)
                        print(f"    ✓ Wohngruppe hinzugefügt")
                    else:
                        print(f"    ✗ Wohngruppe übersprungen (unvollständige Daten)")
                
                except Exception as e:
                    print(f"    Fehler bei Wohngruppe: {str(e)}")
            
            # Kurze Pause, um den Server nicht zu überlasten
            time.sleep(1)
            
        except Exception as e:
            print(f"Fehler bei {link}: {str(e)}")
    
    return wohngruppen

def scrape_other_sources():
    """Weitere Quellen für Wohngruppen-Daten scrapen"""
    # Hier können weitere Quellen hinzugefügt werden
    # z.B. Landesjugendämter, Verzeichnisse, etc.
    pass

def generate_sample_data():
    """Generiert Beispieldaten für die Entwicklung"""
    bundeslaender = [
        "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", 
        "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", 
        "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", 
        "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
    ]
    
    traeger_typen = ["öffentlich", "privat", "kirchlich", "gemeinnützig"]
    
    einrichtungsarten = ["stationär", "teilstationär", "heilpädagogisch"]
    
    paragraphen = ["§34", "§35", "§35a", "§41"]
    
    spezialisierungen = [
        "Traumapädagogik", "Suchtprävention", "Schulverweigerung", 
        "Aggressionsmanagement", "Autismus-Spektrum", "ADHS", 
        "Bindungsstörungen", "Essstörungen", "Selbstverletzendes Verhalten"
    ]
    
    handicaps = [
        "Lernbehinderung", "Körperliche Behinderung", "Geistige Behinderung",
        "Verhaltensauffälligkeit", "Psychische Erkrankung", "Sprachstörung"
    ]
    
    wohngruppen = []
    
    for i in range(100):  # 100 Beispiel-Wohngruppen
        bundesland = bundeslaender[i % len(bundeslaender)]
        
        wg = {
            "name": f"Wohngruppe {i+1}",
            "traeger": {
                "name": f"Träger {i//5 + 1}",
                "typ": traeger_typen[i % len(traeger_typen)],
                "kontakt": {
                    "ansprechpartner": f"Ansprechpartner {i//5 + 1}",
                    "telefon": f"0{i//10 + 1}234-56789",
                    "email": f"kontakt{i//5 + 1}@traeger.de",
                    "website": f"https://traeger{i//5 + 1}.de"
                }
            },
            "adresse": {
                "strasse": f"Beispielstraße {i+1}",
                "plz": f"{10000 + i*89 % 90000}",
                "ort": f"Stadt {i % 20 + 1}",
                "bundesland": bundesland,
                "koordinaten": {
                    "lat": 48 + (i % 10) * 0.5,
                    "lng": 8 + (i % 15) * 0.7
                }
            },
            "art": [einrichtungsarten[i % len(einrichtungsarten)]],
            "paragraphen": [paragraphen[i % len(paragraphen)]],
            "altersbereich": {
                "min": 6 + (i % 10),
                "max": 18 + (i % 5)
            },
            "geschlecht": ["männlich", "weiblich", "gemischt"][i % 3],
            "platzzahl": {
                "gesamt": 6 + (i % 10)
            },
            "spezialisierungen": [
                spezialisierungen[i % len(spezialisierungen)],
                spezialisierungen[(i+3) % len(spezialisierungen)]
            ],
            "handicaps": [
                handicaps[i % len(handicaps)]
            ],
            "beschreibung": f"Dies ist eine Beispiel-Wohngruppe für die Entwicklung des WHG Finders. Sie bietet Platz für Kinder und Jugendliche im Alter von {6 + (i % 10)} bis {18 + (i % 5)} Jahren."
        }
        
        # Manchmal zweite Einrichtungsart hinzufügen
        if i % 3 == 0:
            wg["art"].append(einrichtungsarten[(i+1) % len(einrichtungsarten)])
        
        wohngruppen.append(wg)
    
    return wohngruppen

def main():
    """Hauptfunktion für die Datensammlung"""
    print("Starte Datensammlung für WHG Finder...")
    
    # Daten von freiplatzmeldungen.de sammeln
    wohngruppen = scrape_freiplatzmeldungen()
    
    # Wenn keine Wohngruppen gefunden wurden, Beispieldaten generieren
    if not wohngruppen:
        print("Keine Wohngruppen gefunden. Generiere Beispieldaten für die Entwicklung...")
        wohngruppen = generate_sample_data()
    
    # Daten in JSON-Datei speichern
    with open(f"{OUTPUT_DIR}/wohngruppen.json", 'w', encoding='utf-8') as f:
        json.dump(wohngruppen, f, ensure_ascii=False, indent=2)
    
    print(f"Datensammlung abgeschlossen. {len(wohngruppen)} Wohngruppen gefunden/generiert.")
    
    # Statistiken ausgeben
    stats = {
        "total": len(wohngruppen),
        "by_gender": {
            "männlich": sum(1 for wg in wohngruppen if wg.get("geschlecht") == "männlich"),
            "weiblich": sum(1 for wg in wohngruppen if wg.get("geschlecht") == "weiblich"),
            "gemischt": sum(1 for wg in wohngruppen if wg.get("geschlecht") == "gemischt")
        },
        "by_type": {
            "stationär": sum(1 for wg in wohngruppen if "art" in wg and "stationär" in wg["art"]),
            "teilstationär": sum(1 for wg in wohngruppen if "art" in wg and "teilstationär" in wg["art"]),
            "heilpädagogisch": sum(1 for wg in wohngruppen if "art" in wg and "heilpädagogisch" in wg["art"])
        }
    }
    
    print("Statistiken:")
    print(f"Gesamtzahl der Wohngruppen: {stats['total']}")
    print("Nach Geschlecht:")
    for gender, count in stats["by_gender"].items():
        print(f"  - {gender}: {count}")
    print("Nach Art:")
    for type, count in stats["by_type"].items():
        print(f"  - {type}: {count}")
    
    # Statistiken speichern
    with open(f"{OUTPUT_DIR}/stats.json", 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
