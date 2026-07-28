# Deployment (netcup VPS, Docker)

Continuous Deployment: Jeder Push auf `main` baut das Docker-Image
(GitHub Actions → GHCR) und startet die Services auf dem VPS per SSH neu
(`.github/workflows/deploy.yml`). Stack: Website (Next.js standalone) +
selbst gehostetes Umami + Postgres — siehe `docker-compose.yml`.

## Einmalige Einrichtung

### 1. Auf dem VPS

```bash
# Gemeinsames Netz für den Reverse Proxy (falls noch nicht vorhanden)
docker network create proxy
docker network connect proxy <name-des-reverse-proxy-containers>

# Deploy-Verzeichnis + Secrets
mkdir -p ~/homepage && cd ~/homepage
# .env anlegen (Werte siehe deploy/.env.example):
#   UMAMI_DB_PASSWORD=$(openssl rand -hex 16)
#   UMAMI_APP_SECRET=$(openssl rand -hex 32)

# Nur falls das GHCR-Package privat ist: einmalig anmelden
# (PAT mit Scope read:packages)
docker login ghcr.io -u nikita-petrich
```

Reverse-Proxy-Weiterleitungen (im `proxy`-Netz):

| Domain | Ziel |
|---|---|
| sequenz.io | `http://homepage:3000` |
| stats.sequenz.io (optional, fürs Umami-Dashboard) | `http://umami:3000` |

Der Umami-**Collect**-Endpunkt braucht keine öffentliche Domain — die
Website proxied ihn first-party über `/api/a`.

### 2. Im GitHub-Repo (Settings → Secrets and variables → Actions)

**Secrets:**

| Name | Inhalt |
|---|---|
| `DEPLOY_HOST` | Hostname/IP des VPS |
| `DEPLOY_USER` | SSH-User (Mitglied der `docker`-Gruppe) |
| `DEPLOY_SSH_KEY` | Privater ed25519-Key; Public Key in `~/.ssh/authorized_keys` des Users |

**Variables:**

| Name | Inhalt |
|---|---|
| `UMAMI_WEBSITE_ID` | Website-ID aus dem Umami-Dashboard (siehe Schritt 3) |
| `DEPLOY_PATH` | optional, Standard `~/homepage` |

### 3. Umami initialisieren (nach dem ersten Deploy)

1. Dashboard öffnen (z. B. `stats.sequenz.io`), Login `admin` / `umami` —
   **Passwort sofort ändern**.
2. Website anlegen (`sequenz.io`), die **Website-ID** kopieren.
3. ID als Repository-Variable `UMAMI_WEBSITE_ID` eintragen und den
   Deploy-Workflow einmal erneut laufen lassen (Actions → Deploy →
   „Run workflow") — die ID wird beim Build ins Frontend eingebettet.

Ohne gesetzte `UMAMI_WEBSITE_ID` läuft die Seite normal, nur ohne Messung.

## Betrieb

- **Update:** automatisch bei jedem Push auf `main` (oder manuell via
  „Run workflow").
- **Logs:** `docker compose logs -f homepage` bzw. `umami`.
- **Backup:** Volume `umami-db` sichern
  (`docker exec homepage-umami-db-1 pg_dump -U umami umami > backup.sql`).
- **Server-Logs (Datenschutz):** Access-Logs des Reverse Proxys auf
  IP-Kürzung und ≤ 7 Tage Rotation konfigurieren — die
  Datenschutzerklärung sagt das zu.
