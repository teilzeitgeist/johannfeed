# JohannFeed

Ein kleines Vue 3 Projekt, das mit [Vite](https://vitejs.dev/) gebaut wird. Damit wird der XML Feed von johannstadt.de gezogen und neu visualisiert, damit er auf größeren Bildschirmen als Event-Kalender genutzt werden kann.

## Voraussetzungen

Bevor du startest, brauchst du auf deinem Rechner:

1. **Node.js** (Version 18 oder neuer empfohlen)  
   Prüfen, ob Node installiert ist:
   ```bash
   node -v
    ```

Falls nicht installiert: [Node.js herunterladen](https://nodejs.org/)

2. **npm** (kommt mit Node automatisch)
   Prüfen:

   ```bash
   npm -v
   ```

---

## Installation

1. **Projektordner klonen oder herunterladen**
   Falls Git installiert ist:

   ```bash
   git clone <REPOSITORY_URL>
   ```

   oder als ZIP herunterladen und entpacken.

2. **In den Projektordner wechseln**

   ```bash
   cd johannfeed
   ```

3. **Abhängigkeiten installieren**
   Das lädt alle benötigten Bibliotheken:

   ```bash
   npm install
   ```

---

## Entwicklung (lokal starten)

Zum Starten einer lokalen Entwicklungsumgebung mit automatischem Neuladen:

```bash
  npm run dev
```

Danach im Browser `http://localhost:5173` (oder die angezeigte URL) öffnen.

---

## Produktion (Build erstellen)

Um eine optimierte, produktionsfertige Version zu erstellen:

```bash
  npm run build
```

Die fertigen Dateien liegen danach im Ordner:

```
dist/
```

Diese Dateien kannst du auf einen Webserver hochladen.

---

## Vorschau vom Build

Falls du lokal testen willst, wie der Build aussieht:

```bash
  npm run preview
```

Dann die angezeigte URL im Browser öffnen.

---

## Code-Formatierung & Linting

* Code automatisch formatieren:

  ```bash
  npm run format
  ```

* Code auf Fehler prüfen:

  ```bash
  npm run eslint
  ```

* Fehler automatisch beheben (soweit möglich):

  ```bash
  npm run eslint:fix
  ```

---

## Zusammenfassung der wichtigsten Befehle

| Befehl               | Zweck                                         |
| -------------------- | --------------------------------------------- |
| `npm install`        | Abhängigkeiten installieren                   |
| `npm run dev`        | Lokale Entwicklungsumgebung starten           |
| `npm run build`      | Produktions-Build erstellen                   |
| `npm run preview`    | Build lokal testen                            |
| `npm run format`     | Code formatieren                              |
| `npm run eslint`     | Code auf Probleme prüfen                      |
| `npm run eslint:fix` | Codeprobleme automatisch beheben (wo möglich) |

