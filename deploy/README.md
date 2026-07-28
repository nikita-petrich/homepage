# Deployment (netcup VPS, Docker)

## Wie die Pipeline funktioniert

Jeder Push auf `main` (oder ein manueller Start unter Actions → Deploy →
„Run workflow") durchläuft zwei Jobs (`.github/workflows/deploy.yml`), beide
im GitHub-Environment **`prod`**:

1. **build-and-push** — baut aus dem `Dockerfile` das Produktions-Image
   (Next.js-Standalone-Build, läuft als non-root User) und pusht es nach
   GHCR als `ghcr.io/nikita-petrich/homepage:latest` (plus Commit-SHA-Tag
   für Rollbacks). Die Umami-Website-ID wird dabei als Build-Argument ins
   Frontend eingebettet — deshalb braucht auch dieser Job das
   `prod`-Environment.
2. **deploy** — verbindet sich per SSH mit dem VPS und
   - legt `/opt/stacks/homepage` an (fester Pfad, hartkodiert),
   - kopiert `deploy/docker-compose.yml` dorthin,
   - schreibt die `.env` (DB-Passwort, App-Secret) **aus den GitHub-Secrets**
     mit `chmod 600` — auf dem Server wird nichts Geheimes von Hand gepflegt,
   - führt `docker compose pull && docker compose up -d` aus und räumt alte
     Images auf.

Der Stack (`docker-compose.yml`) besteht aus drei Services:

| Service | Zweck | Netz |
|---|---|---|
| `homepage` | die Website (Port 3000 im Container) | `proxy` + `internal` |
| `umami` | Analytics-Dashboard & Collect-API | `proxy` + `internal` |
| `umami-db` | PostgreSQL für Umami (persistentes Volume) | nur `internal` |

Dein Reverse Proxy hängt im externen Docker-Netz `proxy` und leitet dorthin
weiter; die Datenbank ist von außen nicht erreichbar. Der Umami-Collect-
Endpunkt braucht keine öffentliche Domain: Die Website leitet Messdaten
serverseitig über ihre eigene Route `/api/a` an `http://umami:3000` weiter
(First-Party, ohne Client-IP-Weitergabe).

## Einmalige Einrichtung

### Schritt 1 — GitHub-Environment `prod` anlegen

Repo → Settings → Environments → **New environment** → Name: `prod`.
Dort eintragen:

**Environment Secrets:**

| Name | Inhalt |
|---|---|
| `VPS_HOST` | Hostname oder IP des VPS |
| `VPS_USER` | SSH-User für das Deployment (siehe Schritt 2) |
| `VPS_SSH_KEY` | privater ed25519-Key für diesen User (kompletter Inhalt der Key-Datei inkl. `-----BEGIN/END-----`-Zeilen) |
| `UMAMI_DB_PASSWORD` | Postgres-Passwort, z. B. `openssl rand -hex 16` |
| `UMAMI_APP_SECRET` | Umami-App-Secret, z. B. `openssl rand -hex 32` |

**Environment Variables:**

| Name | Inhalt |
|---|---|
| `UMAMI_WEBSITE_ID` | Website-ID aus dem Umami-Dashboard — gibt es erst nach Schritt 4, anfangs leer lassen |

(`UMAMI_WEBSITE_ID` ist bewusst eine Variable und kein Secret: Die ID steht
ohnehin öffentlich im ausgelieferten HTML.)

### Schritt 2 — VPS vorbereiten

```bash
# 2a. SSH-Keypair für das Deployment erzeugen (lokal oder auf dem VPS):
ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-deploy"
#   → Inhalt von deploy_key        = Secret VPS_SSH_KEY
#   → Inhalt von deploy_key.pub    → auf dem VPS in ~/.ssh/authorized_keys
#     des Deploy-Users eintragen

# 2b. Der Deploy-User muss Docker nutzen dürfen:
sudo usermod -aG docker <deploy-user>

# 2c. Stack-Verzeichnis anlegen und dem Deploy-User übertragen:
sudo mkdir -p /opt/stacks/homepage
sudo chown <deploy-user>:<deploy-user> /opt/stacks/homepage

# 2d. Gemeinsames Docker-Netz für den Reverse Proxy (falls nicht vorhanden):
docker network create proxy
docker network connect proxy <name-des-reverse-proxy-containers>

# 2e. Nur falls das GHCR-Package privat bleibt: einmalig anmelden
#     (GitHub-PAT mit Scope read:packages):
docker login ghcr.io -u nikita-petrich
```

### Schritt 3 — Reverse Proxy konfigurieren

Weiterleitungen ins `proxy`-Netz (Service-Namen sind DNS-Namen):

| Domain | Ziel |
|---|---|
| `sequenz.io` | `http://homepage:3000` |
| `stats.sequenz.io` (fürs Umami-Dashboard) | `http://umami:3000` |

TLS terminiert dein Reverse Proxy; die App setzt HSTS und die übrigen
Security-Header selbst. Datenschutz-Zusage aus der Datenschutzerklärung
beachten: Access-Logs des Proxys auf **IP-Kürzung und ≤ 7 Tage Rotation**
konfigurieren.

### Schritt 4 — Erster Deploy und Umami initialisieren

1. Actions → **Deploy** → „Run workflow" (oder einfach auf `main` pushen).
   Der Stack startet; die Website läuft ab jetzt — Messung noch aus, weil
   `UMAMI_WEBSITE_ID` leer ist.
2. `stats.sequenz.io` öffnen, Login `admin` / `umami` —
   **Passwort sofort ändern**.
3. In Umami eine Website anlegen (Name/Domain `sequenz.io`) und die
   **Website-ID** kopieren.
4. Die ID im `prod`-Environment als Variable `UMAMI_WEBSITE_ID` eintragen
   und den Deploy-Workflow **einmal erneut** laufen lassen — erst dieser
   Build bettet die ID ins Frontend ein. Danach laufen die Events auf.

## Betrieb

- **Update:** automatisch bei jedem Push auf `main`; manuell über
  „Run workflow".
- **Rollback:** auf dem VPS in `/opt/stacks/homepage` das Image-Tag im
  Compose-File temporär auf einen früheren Commit-SHA setzen
  (`ghcr.io/nikita-petrich/homepage:<sha>`) und `docker compose up -d` —
  oder den alten Commit auf `main` revert-pushen.
- **Secret-Rotation:** Wert im `prod`-Environment ändern, Deploy laufen
  lassen. Achtung bei `UMAMI_DB_PASSWORD`: Postgres übernimmt ein neues
  Passwort nicht automatisch für eine bestehende DB — zusätzlich einmal
  `docker exec -it homepage-umami-db-1 psql -U umami -c "ALTER USER umami WITH PASSWORD '<neu>';"`.
- **Logs:** `docker compose logs -f homepage` bzw. `umami` / `umami-db`.
- **Backup:** `docker exec homepage-umami-db-1 pg_dump -U umami umami > backup.sql`
  (das Volume `umami-db` hält die Daten; die Website selbst ist zustandslos).
