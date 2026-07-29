# Deployment (netcup VPS, Docker)

Diese Anleitung führt Schritt für Schritt durch die einmalige Einrichtung.
Danach genügt ein Push auf `main` und die Seite ist live.

---

## Teil A — Wie das Ganze funktioniert

### Die zwei Workflows

| Workflow | Läuft wann | Was er tut |
|---|---|---|
| `ci.yml` | bei jedem Push und Pull Request | `pnpm install`, `lint`, `typecheck`, `build`, `audit --prod` — verhindert, dass kaputter Code nach `main` kommt |
| `deploy.yml` | bei Push auf `main` + manuell | baut das Docker-Image und rollt es auf dem VPS aus |

### Was `deploy.yml` genau macht

**Job 1 „build-and-push"** baut aus dem `Dockerfile` das Produktions-Image
und lädt es in die GitHub Container Registry (GHCR) hoch — unter zwei Namen:
`ghcr.io/nikita-petrich/homepage:latest` und `…:<commit-sha>` (zweiteres ist
der Anker für Rollbacks).

Wichtig zu verstehen: Die Umami-Website-ID wird **beim Bauen** fest ins
JavaScript eingebacken. Alles mit dem Prefix `NEXT_PUBLIC_` ist in Next.js
Build-Zeit-Konfiguration, keine Laufzeit-Variable. Deshalb hängt auch dieser
Job am `prod`-Environment, und deshalb muss nach dem Eintragen der Website-ID
einmal neu gebaut werden.

**Job 2 „deploy"** verbindet sich per SSH mit dem VPS und macht vier Dinge:

1. `/opt/stacks/homepage` anlegen (fester Pfad, im Workflow hartkodiert),
2. `deploy/docker-compose.yml` dorthin kopieren,
3. die `.env`-Datei **aus den GitHub-Secrets** schreiben (`chmod 600`),
4. `docker compose pull && docker compose up -d` und alte Images aufräumen.

Der Server hält also keine Geheimnisse, die du von Hand pflegen musst — die
einzige Quelle der Wahrheit ist das GitHub-Environment `prod`.

### Der Stack auf dem VPS

| Container | Zweck | Netze |
|---|---|---|
| `homepage` | die Website (Port 3000 im Container) | `edge` + `internal` |
| `umami` | Analytics-Dashboard und Collect-API | `edge` + `internal` |
| `umami-db` | PostgreSQL für Umami (Volume `umami-db`) | nur `internal` |

`edge` ist das bestehende externe Netz, in dem auch dein Reverse Proxy und
n8n laufen — dadurch erreicht der Proxy die Container über ihre Namen. Die
Datenbank hängt nur im selbst angelegten Netz `internal` und ist damit aus
dem Internet nicht erreichbar.

Die Messdaten der Besucher gehen **nie direkt an Umami**: Der Browser spricht
ausschließlich
`https://sequenz.io/api/a`, und die Next.js-App reicht das serverseitig an
`http://umami:3000` weiter — ohne die IP-Adresse des Besuchers mitzugeben.
Genau das macht die Messung DSGVO-seitig unkritisch.

---

## Teil B — Einrichtung

### Schritt 1: SSH-Schlüssel für das Deployment erzeugen

GitHub muss sich beim VPS anmelden dürfen. Dafür brauchst du ein
Schlüsselpaar: Der **private** Schlüssel kommt als Secret nach GitHub, der
**öffentliche** auf den Server.

Auf deinem lokalen Rechner (nicht auf dem VPS):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/homepage_deploy -N "" -C "github-deploy-homepage"
```

Erklärung der Optionen: `-t ed25519` = moderner Schlüsseltyp, `-f …` = wohin
gespeichert wird, `-N ""` = **ohne Passphrase** (wichtig — GitHub kann keine
Passphrase eingeben), `-C …` = Kommentar zur Wiedererkennung.

Es entstehen zwei Dateien:

| Datei | Das ist … | Kommt wohin |
|---|---|---|
| `~/.ssh/homepage_deploy` | der **private** Schlüssel | GitHub-Secret `VPS_SSH_KEY` |
| `~/.ssh/homepage_deploy.pub` | der **öffentliche** Schlüssel | auf den VPS |

Öffentlichen Schlüssel auf den Server bringen (ersetze User und Host):

```bash
ssh-copy-id -i ~/.ssh/homepage_deploy.pub deployuser@dein-vps.example.com
```

Falls `ssh-copy-id` nicht verfügbar ist, geht es auch von Hand:

```bash
cat ~/.ssh/homepage_deploy.pub | ssh deployuser@dein-vps.example.com \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Testen, dass die Anmeldung ohne Passwort klappt:

```bash
ssh -i ~/.ssh/homepage_deploy deployuser@dein-vps.example.com "echo Verbindung OK"
```

Den **privaten** Schlüssel für GitHub in die Zwischenablage holen:

```bash
cat ~/.ssh/homepage_deploy          # macOS: pbcopy < ~/.ssh/homepage_deploy
```

Kopiere den **kompletten** Inhalt inklusive der Zeilen
`-----BEGIN OPENSSH PRIVATE KEY-----` und `-----END OPENSSH PRIVATE KEY-----`
sowie des abschließenden Zeilenumbruchs. Das ist der Wert für `VPS_SSH_KEY`.

> Der private Schlüssel gehört nirgendwo anders hin — nicht ins Repo, nicht
> in eine Notiz-App. Wenn er je abhandenkommt: neuen erzeugen, alten aus
> `~/.ssh/authorized_keys` auf dem VPS löschen.

### Schritt 2: Passwörter für Umami erzeugen

Zwei zufällige Werte, die du dir **nicht merken musst** — sie werden nur in
GitHub gespeichert und von dort auf den Server geschrieben. Erzeuge sie auf
deinem Rechner oder dem VPS:

```bash
openssl rand -hex 16    # → Wert für UMAMI_DB_PASSWORD (32 Zeichen)
openssl rand -hex 32    # → Wert für UMAMI_APP_SECRET (64 Zeichen)
```

Was die beiden tun:

- **`UMAMI_DB_PASSWORD`** — das Passwort, mit dem sich Umami bei seiner
  eigenen PostgreSQL-Datenbank anmeldet. Beide Container bekommen es aus
  derselben Variable, sie müssen also zusammenpassen.
- **`UMAMI_APP_SECRET`** — der Schlüssel, mit dem Umami die Login-Sitzungen
  seines Dashboards signiert. Ändert man ihn, werden alle Dashboard-Logins
  ungültig (mehr passiert nicht).

Falls `openssl` fehlt, geht auch:

```bash
head -c 16 /dev/urandom | xxd -p     # bzw. -c 32 für das App-Secret
```

Jeden Wert direkt kopieren und im nächsten Schritt einfügen.

### Schritt 3: GitHub-Environment `prod` anlegen

Im Browser: Repo **nikita-petrich/homepage** → **Settings** →
links **Environments** → **New environment** → Name: `prod` → **Configure
environment**.

Dann auf dieser Seite unten:

**„Environment secrets" → „Add secret"** — fünf Stück:

| Name | Wert |
|---|---|
| `VPS_HOST` | Hostname oder IP des VPS, z. B. `v1234.netcup.net` |
| `VPS_USER` | der SSH-Benutzername, z. B. `deployuser` |
| `VPS_SSH_KEY` | kompletter Inhalt von `~/.ssh/homepage_deploy` (Schritt 1) |
| `UMAMI_DB_PASSWORD` | der `openssl rand -hex 16`-Wert (Schritt 2) |
| `UMAMI_APP_SECRET` | der `openssl rand -hex 32`-Wert (Schritt 2) |

**„Environment variables" → „Add variable"** — eine:

| Name | Wert |
|---|---|
| `UMAMI_WEBSITE_ID` | vorerst **leer lassen** — die ID gibt es erst nach Schritt 6 |

Warum Variable und nicht Secret? Die Website-ID steht ohnehin öffentlich im
ausgelieferten HTML — sie ist kein Geheimnis, und als Variable siehst du sie
später im Klartext, was das Debuggen erleichtert.

> Secrets kannst du nach dem Speichern nie wieder auslesen, nur überschreiben.
> Das ist normal — hebe die Werte bei Bedarf in deinem Passwort-Manager auf.

### Schritt 4: VPS vorbereiten

Auf dem VPS einloggen und ausführen (ersetze `deployuser`):

```bash
# 4a. Der Deploy-User muss Docker steuern dürfen
sudo usermod -aG docker deployuser
#     danach einmal ab- und wieder anmelden, damit die Gruppe greift

# 4b. Stack-Verzeichnis anlegen und dem Deploy-User geben
sudo mkdir -p /opt/stacks/homepage
sudo chown deployuser:deployuser /opt/stacks/homepage

# 4c. Prüfen, dass das externe Netz "edge" existiert
docker network ls | grep edge
```

Der Stack hängt sich in das bestehende Netz **`edge`**, in dem dein Reverse
Proxy ([nikita-petrich/reverse-proxy](https://github.com/nikita-petrich/reverse-proxy))
und n8n bereits laufen. Es ist dort als `external: true` deklariert, wird also
außerhalb der Compose-Dateien verwaltet. Falls es wider Erwarten fehlt:

```bash
docker network create edge
```

Wenn dein GHCR-Package privat bleiben soll, muss sich der VPS einmalig an der
Registry anmelden (GitHub-PAT mit Scope `read:packages`):

```bash
docker login ghcr.io -u nikita-petrich
```

Machst du das Package öffentlich (GitHub → Packages → homepage → Package
settings → Change visibility → Public), entfällt der Login. Für eine
Portfolio-Website ist beides vertretbar.

### Schritt 5: Reverse Proxy erweitern

In deinem `reverse-proxy/compose.yml` müssen nur die zwei Domain-Variablen
wachsen — der Rest (Ports, Volume, `FORCE_HTTPS`, `RESOLVER_ADDRESS`, Netz
`edge`) bleibt unverändert:

```yaml
environment:
  ALLOWED_DOMAINS: "(www.|n8n.|stats.)?sequenz.io"
  SITES: "sequenz.io=homepage:3000; www.sequenz.io=homepage:3000; stats.sequenz.io=umami:3000; n8n.sequenz.io=n8n:5678"
  FORCE_HTTPS: "true"
  RESOLVER_ADDRESS: "127.0.0.11"
```

Dann im Reverse-Proxy-Verzeichnis `docker compose up -d`.

Was die beiden Variablen bedeuten:

- **`ALLOWED_DOMAINS`** ist ein **Regex**, keine Komma-Liste — nur passende
  Hostnamen bekommen automatisch ein Let's-Encrypt-Zertifikat. Das Muster
  oben erlaubt `sequenz.io`, `www.sequenz.io`, `stats.sequenz.io` und
  `n8n.sequenz.io`.

  > **Wichtig: keine Backslashes verwenden.** Der Wert wird im Image in ein
  > Lua-Skript eingesetzt, und `\.` ist in Lua keine gültige Escape-Sequenz —
  > der Container startet dann in einer Endlosschleife neu. Punkte bleiben
  > deshalb unescaped (sie matchen als „beliebiges Zeichen", was hier
  > unkritisch ist); genauso machen es die offiziellen Beispiele des Images.
  > Auch ein `$` am Ende vermeiden: Docker Compose interpretiert `$` als
  > Variablen-Präfix.
- **`SITES`** ist die Weiterleitungstabelle im Format `domain=ziel;
  domain=ziel`. `homepage` und `umami` sind die Container-Namen aus
  `deploy/docker-compose.yml`; Docker löst sie im Netz `edge` automatisch per
  DNS auf (dafür steht dein `RESOLVER_ADDRESS: 127.0.0.11` — das ist Dockers
  eingebauter DNS-Server). Dein bestehender n8n-Eintrag bleibt einfach
  stehen.

**Voraussetzung DNS:** Die A-Records für `sequenz.io`, `www.sequenz.io` und
`stats.sequenz.io` müssen auf die IP des VPS zeigen, sonst kann Let's Encrypt
kein Zertifikat ausstellen. `n8n.sequenz.io` hast du ja bereits.

**Zu `www`:** Der Proxy leitet `www.sequenz.io` an denselben Container weiter;
die App antwortet darauf mit einer permanenten Weiterleitung (HTTP 308) auf
`https://sequenz.io` — inklusive Pfad, `www.sequenz.io/projekte/aitoi` landet
also auf `sequenz.io/projekte/aitoi`. So bleibt genau eine kanonische URL,
was Duplicate Content bei Suchmaschinen vermeidet (konfiguriert über
`redirects()` in `next.config.ts`).

Hinweis:

- **Datenschutz:** Die Datenschutzerklärung sagt zu, dass Server-Logs gekürzt
  und nach spätestens 7 Tagen gelöscht werden. Konfiguriere die Access-Logs
  des Proxys entsprechend (IP-Kürzung, Rotation ≤ 7 Tage).

### Schritt 6: Erster Deploy und Umami einrichten

1. **Branch nach `main` mergen** (oder: Actions → **Deploy** → **Run
   workflow**). Der Workflow läuft ~3–5 Minuten. Unter „Actions" kannst du
   live zusehen; bei einem Fehler steht dort genau, welcher Schritt gescheitert
   ist.
2. `https://sequenz.io` aufrufen — die Seite läuft. Die Messung ist noch
   aus, weil `UMAMI_WEBSITE_ID` leer ist. Das ist erwartet.
3. `https://stats.sequenz.io` aufrufen → Login **`admin`** / **`umami`** →
   **Passwort sofort ändern** (oben rechts → Profile → Change password).
   Das ist wichtig: Die Seite ist öffentlich erreichbar, die
   Standard-Zugangsdaten sind allgemein bekannt.
4. Dort **Settings → Websites → Add website**: Name `sequenz.io`, Domain
   `sequenz.io`. Nach dem Speichern die **Website ID** kopieren (eine UUID
   wie `b4f2c1a8-…`).
5. Diese ID in GitHub eintragen: Settings → Environments → `prod` →
   `UMAMI_WEBSITE_ID` bearbeiten → einfügen → speichern.
6. **Deploy erneut starten**: Actions → Deploy → Run workflow. Erst dieser
   Build backt die ID ins Frontend ein.
7. Website öffnen, ein bisschen klicken — im Umami-Dashboard sollten unter
   „Events" nach kurzer Zeit Einträge wie `cv_download`, `booking_click`,
   `project_open` erscheinen.

---

## Teil C — Betrieb

**Statistiken ansehen:** `https://stats.sequenz.io` im Browser öffnen.

**Normales Update:** Änderung committen, nach `main` pushen — fertig. Der
Deploy läuft automatisch.

**Rollback:** Auf dem VPS in `/opt/stacks/homepage` das Image-Tag im
`docker-compose.yml` temporär auf einen früheren Commit setzen
(`ghcr.io/nikita-petrich/homepage:<commit-sha>`) und `docker compose up -d`.
Sauberer für Dauerhaftes: den fehlerhaften Commit in Git reverten und pushen.

**Logs ansehen:**

```bash
cd /opt/stacks/homepage
docker compose logs -f homepage     # oder: umami, umami-db
docker compose ps                   # Status aller Container
```

**Secrets ändern:** Wert im `prod`-Environment überschreiben, Deploy laufen
lassen. **Achtung bei `UMAMI_DB_PASSWORD`:** PostgreSQL übernimmt ein neues
Passwort nicht automatisch für eine bereits bestehende Datenbank — du musst
es dort zusätzlich setzen:

```bash
docker exec -it umami-db \
  psql -U umami -c "ALTER USER umami WITH PASSWORD 'neuer-wert';"
```

**Backup:** Die Website selbst ist zustandslos (alles liegt im Git). Sichern
musst du nur die Analytics-Datenbank:

```bash
docker exec umami-db pg_dump -U umami umami > umami-backup-$(date +%F).sql
```

**Wenn etwas nicht läuft:**

| Symptom | Wahrscheinliche Ursache |
|---|---|
| Deploy scheitert bei „Set up SSH" | `VPS_SSH_KEY` unvollständig kopiert (BEGIN/END-Zeilen fehlen) oder `VPS_HOST` falsch |
| Deploy scheitert bei „Pull and restart" | Deploy-User nicht in der `docker`-Gruppe, oder GHCR-Login fehlt bei privatem Package |
| `docker compose up` meldet „network edge not found" | Das externe Netz `edge` existiert nicht — `docker network create edge` (Schritt 4c) |
| Proxy meldet 502 für sequenz.io | Container `homepage` läuft nicht, oder der `SITES`-Eintrag zeigt auf den falschen Namen/Port (`homepage:3000`) |
| Seite lädt, aber keine Events in Umami | `UMAMI_WEBSITE_ID` gesetzt, aber kein neuer Deploy gelaufen (Schritt 6.6) |
| Umami-Container startet nicht | `UMAMI_DB_PASSWORD` nach dem ersten Start geändert, ohne es in Postgres nachzuziehen |
