# Deployment (netcup VPS, Docker)

Continuous Deployment: Jeder Push auf `main` baut das Docker-Image
(GitHub Actions → GHCR), schreibt Compose-Datei **und** `.env` (aus GitHub
Secrets) auf den VPS und startet die Services per SSH neu
(`.github/workflows/deploy.yml`). Stack: Website (Next.js standalone) +
selbst gehostetes Umami + Postgres — siehe `docker-compose.yml`.

Auf dem Server wird nichts Geheimes von Hand gepflegt — alle Secrets und
Variablen leben im GitHub-**Environment `prod`**. Der Code liegt auf dem VPS
unter `/opt/stacks/homepage`.

## Einmalige Einrichtung

### 1. Im GitHub-Repo

Settings → Environments → **New environment** → Name `prod`. Dort anlegen
(beide Deploy-Jobs referenzieren `environment: prod` — Repo-weite Secrets
funktionieren ebenfalls, das Environment ist aber die eine Quelle der
Wahrheit und erlaubt später Protection Rules):

**Environment Secrets:**

| Name | Inhalt |
|---|---|
| `DEPLOY_HOST` | Hostname/IP des VPS |
| `DEPLOY_USER` | SSH-User (Mitglied der `docker`-Gruppe) |
| `DEPLOY_SSH_KEY` | Privater ed25519-Key; Public Key in `~/.ssh/authorized_keys` des Users |
| `UMAMI_DB_PASSWORD` | z. B. `openssl rand -hex 16` |
| `UMAMI_APP_SECRET` | z. B. `openssl rand -hex 32` |

**Environment Variables:**

| Name | Inhalt |
|---|---|
| `UMAMI_WEBSITE_ID` | Website-ID aus dem Umami-Dashboard (siehe Schritt 3) |
| `DEPLOY_PATH` | optional, Standard `/opt/stacks/homepage` |

Hinweis: `UMAMI_WEBSITE_ID` ist bewusst eine *Variable*, kein Secret — die
ID steht ohnehin öffentlich im ausgelieferten HTML.

### 2. Auf dem VPS

```bash
# Stack-Verzeichnis anlegen und dem Deploy-User übertragen
sudo mkdir -p /opt/stacks/homepage
sudo chown <deploy-user>:<deploy-user> /opt/stacks/homepage

# Gemeinsames Netz für den Reverse Proxy (falls noch nicht vorhanden)
docker network create proxy
docker network connect proxy <name-des-reverse-proxy-containers>

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
- **Secret-Rotation:** Wert in GitHub Secrets ändern, Deploy laufen lassen.
  Achtung bei `UMAMI_DB_PASSWORD`: Postgres übernimmt ein neues Passwort
  nicht automatisch für eine bestehende Datenbank — dort zusätzlich
  `ALTER USER umami WITH PASSWORD '<neu>';` ausführen.
- **Logs:** `docker compose logs -f homepage` bzw. `umami`.
- **Backup:** Volume `umami-db` sichern
  (`docker exec homepage-umami-db-1 pg_dump -U umami umami > backup.sql`).
- **Server-Logs (Datenschutz):** Access-Logs des Reverse Proxys auf
  IP-Kürzung und ≤ 7 Tage Rotation konfigurieren — die
  Datenschutzerklärung sagt das zu.
