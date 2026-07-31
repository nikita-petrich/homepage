# Deployment (netcup VPS, Docker)

This guide walks through the one-time setup step by step. After that a push to
`main` is all it takes for the site to go live.

---

## Part A — How the whole thing works

### The two workflows

| Workflow | Runs when | What it does |
|---|---|---|
| `ci.yml` | on every push and pull request | `pnpm install`, `lint`, `typecheck`, `build`, `audit --prod` — keeps broken code from reaching `main` |
| `deploy.yml` | on push to `main` + manually | builds the Docker image and rolls it out on the VPS |

### What `deploy.yml` does exactly

**Job 1 "build-and-push"** builds the production image from the `Dockerfile`
and uploads it to the GitHub Container Registry (GHCR) — under two names:
`ghcr.io/nikita-petrich/homepage:latest` and `…:<commit-sha>` (the latter is
the anchor for rollbacks).

Important to understand: the Umami website ID is baked into the JavaScript
**at build time**. In Next.js everything with the `NEXT_PUBLIC_` prefix is
build-time configuration, not a runtime variable. That is why this job also
depends on the `prod` environment, and why a rebuild is required once the
website ID has been entered.

**Job 2 "deploy"** connects to the VPS over SSH and does four things:

1. create `/opt/stacks/homepage` (fixed path, hardcoded in the workflow),
2. copy `deploy/docker-compose.yml` there,
3. write the `.env` file **from the GitHub secrets** (`chmod 600`),
4. run `docker compose pull && docker compose up -d` and clean up old images.

So the server holds no secrets you have to maintain by hand — the single
source of truth is the GitHub environment `prod`.

### The stack on the VPS

| Container | Purpose | Networks |
|---|---|---|
| `homepage` | the website (port 3000 inside the container) | `edge` + `internal` |
| `umami` | analytics dashboard and collect API | `edge` + `internal` |
| `umami-db` | PostgreSQL for Umami (volume `umami-db`) | `internal` only |

`edge` is the existing external network that your reverse proxy and n8n also
run on — which is how the proxy reaches the containers by name. The database
only sits in the self-created `internal` network and is therefore unreachable
from the internet.

Visitor measurement data **never goes to Umami directly**: the browser talks
exclusively to
`https://sequenz.io/api/a`, and the Next.js app forwards that server-side to
`http://umami:3000` — without passing on the visitor's IP address. That is
precisely what makes the measurement unproblematic under the GDPR.

---

## Part B — Setup

### Step 1: Generate an SSH key for the deployment

GitHub needs permission to log in to the VPS. For that you need a key pair:
the **private** key goes to GitHub as a secret, the **public** one onto the
server.

On your local machine (not on the VPS):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/homepage_deploy -N "" -C "github-deploy-homepage"
```

What the options mean: `-t ed25519` = modern key type, `-f …` = where it is
saved, `-N ""` = **without a passphrase** (important — GitHub cannot type a
passphrase), `-C …` = comment so you recognise it later.

Two files are created:

| File | This is … | Goes where |
|---|---|---|
| `~/.ssh/homepage_deploy` | the **private** key | GitHub secret `VPS_SSH_KEY` |
| `~/.ssh/homepage_deploy.pub` | the **public** key | onto the VPS |

Get the public key onto the server (replace user and host):

```bash
ssh-copy-id -i ~/.ssh/homepage_deploy.pub deployuser@your-vps.example.com
```

If `ssh-copy-id` is not available, it also works by hand:

```bash
cat ~/.ssh/homepage_deploy.pub | ssh deployuser@your-vps.example.com \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Test that logging in without a password works:

```bash
ssh -i ~/.ssh/homepage_deploy deployuser@your-vps.example.com "echo connection OK"
```

Get the **private** key into the clipboard for GitHub:

```bash
cat ~/.ssh/homepage_deploy          # macOS: pbcopy < ~/.ssh/homepage_deploy
```

Copy the **entire** contents including the lines
`-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`
as well as the trailing newline. That is the value for `VPS_SSH_KEY`.

> The private key does not belong anywhere else — not in the repo, not in a
> notes app. If it ever goes missing: generate a new one and delete the old
> one from `~/.ssh/authorized_keys` on the VPS.

### Step 2: Generate passwords for Umami

Two random values you **do not have to remember** — they are only stored in
GitHub and written from there onto the server. Generate them on your machine
or on the VPS:

```bash
openssl rand -hex 16    # → value for UMAMI_DB_PASSWORD (32 characters)
openssl rand -hex 32    # → value for UMAMI_APP_SECRET (64 characters)
```

What the two of them do:

- **`UMAMI_DB_PASSWORD`** — the password Umami uses to log in to its own
  PostgreSQL database. Both containers get it from the same variable, so they
  have to match.
- **`UMAMI_APP_SECRET`** — the key Umami signs its dashboard login sessions
  with. Changing it invalidates all dashboard logins (nothing more than that
  happens).

If `openssl` is missing, this also works:

```bash
head -c 16 /dev/urandom | xxd -p     # or -c 32 for the app secret
```

Copy each value straight away and paste it in the next step.

### Step 3: Create the GitHub environment `prod`

In the browser: repo **nikita-petrich/homepage** → **Settings** →
**Environments** on the left → **New environment** → name: `prod` →
**Configure environment**.

Then at the bottom of that page:

**"Environment secrets" → "Add secret"** — five of them:

| Name | Value |
|---|---|
| `VPS_HOST` | hostname or IP of the VPS, e.g. `v1234.netcup.net` |
| `VPS_USER` | the SSH username, e.g. `deployuser` |
| `VPS_SSH_KEY` | full contents of `~/.ssh/homepage_deploy` (step 1) |
| `UMAMI_DB_PASSWORD` | the `openssl rand -hex 16` value (step 2) |
| `UMAMI_APP_SECRET` | the `openssl rand -hex 32` value (step 2) |

**"Environment variables" → "Add variable"** — one:

| Name | Value |
|---|---|
| `UMAMI_WEBSITE_ID` | **leave empty for now** — the ID only exists after step 6 |

Why a variable and not a secret? The website ID is public in the delivered
HTML anyway — it is not a secret, and as a variable you can read it in plain
text later, which makes debugging easier.

> Secrets can never be read back after saving, only overwritten. That is
> normal — keep the values in your password manager if you need them.

### Step 4: Prepare the VPS

Log in to the VPS and run (replace `deployuser`):

```bash
# 4a. The deploy user has to be allowed to drive Docker
sudo usermod -aG docker deployuser
#     then log out and back in once so the group takes effect

# 4b. Create the stack directory and hand it to the deploy user
sudo mkdir -p /opt/stacks/homepage
sudo chown deployuser:deployuser /opt/stacks/homepage

# 4c. Check that the external network "edge" exists
docker network ls | grep edge
```

The stack attaches itself to the existing network **`edge`**, on which your
reverse proxy ([nikita-petrich/reverse-proxy](https://github.com/nikita-petrich/reverse-proxy))
and n8n already run. It is declared there as `external: true`, so it is
managed outside the compose files. If it is missing against expectations:

```bash
docker network create edge
```

If you want your GHCR package to stay private, the VPS has to log in to the
registry once (GitHub PAT with scope `read:packages`):

```bash
docker login ghcr.io -u nikita-petrich
```

If you make the package public (GitHub → Packages → homepage → Package
settings → Change visibility → Public), the login is unnecessary. For a
portfolio website either is defensible.

### Step 5: Extend the reverse proxy

In your `reverse-proxy/compose.yml` only the two domain variables have to
grow — the rest (ports, volume, `FORCE_HTTPS`, `RESOLVER_ADDRESS`, network
`edge`) stays unchanged:

```yaml
environment:
  ALLOWED_DOMAINS: "(www.|n8n.|stats.)?sequenz.io"
  SITES: "sequenz.io=homepage:3000;www.sequenz.io=homepage:3000;stats.sequenz.io=umami:3000;n8n.sequenz.io=n8n:5678"
  FORCE_HTTPS: "true"
  RESOLVER_ADDRESS: "127.0.0.11"
```

Then run `docker compose up -d` in the reverse-proxy directory.

What the two variables mean:

- **`ALLOWED_DOMAINS`** is a **regex**, not a comma-separated list — only
  matching hostnames automatically get a Let's Encrypt certificate. The
  pattern above allows `sequenz.io`, `www.sequenz.io`, `stats.sequenz.io` and
  `n8n.sequenz.io`.

  > **Important: do not use backslashes.** The value is substituted into a Lua
  > script inside the image, and `\.` is not a valid escape sequence in Lua —
  > the container then restarts in an endless loop. Dots therefore stay
  > unescaped (they match as "any character", which is harmless here); the
  > image's official examples do exactly the same. Also avoid a trailing `$`:
  > Docker Compose interprets `$` as a variable prefix.
- **`SITES`** is the forwarding table in the format
  `domain=target;domain=target`.

  > **Important: no spaces after the semicolons.** The image's entrypoint
  > splits only on `;` and does not trim; a leading space ends up in the
  > server name, and writing the config file then fails with an "ambiguous
  > redirect" in Bash. Affected entries are skipped silently — only the first
  > entry survives, and it thereby becomes the default server for *all*
  > domains (symptom: every subdomain shows the same page).

  `homepage` and `umami` are the container names from
  `deploy/docker-compose.yml`; Docker resolves them automatically via DNS on
  the `edge` network (that is what your `RESOLVER_ADDRESS: 127.0.0.11` is for
  — Docker's built-in DNS server). Your existing n8n entry simply stays.

**DNS prerequisite:** the A records for `sequenz.io`, `www.sequenz.io` and
`stats.sequenz.io` have to point at the VPS's IP, otherwise Let's Encrypt
cannot issue a certificate. You already have `n8n.sequenz.io`.

**On `www`:** the proxy forwards `www.sequenz.io` to the same container; the
app answers with a permanent redirect (HTTP 308) to `https://sequenz.io` —
including the path, so `www.sequenz.io/projects/aitoi` ends up at
`sequenz.io/projects/aitoi`. That leaves exactly one canonical URL, which
avoids duplicate content with search engines (configured via `redirects()` in
`next.config.ts`).

Note:

- **Privacy:** the privacy policy promises that server logs are truncated and
  deleted after 7 days at the latest. Configure the proxy's access logs
  accordingly (IP truncation, rotation ≤ 7 days).

### Step 6: First deploy and Umami setup

1. **Merge the branch into `main`** (or: Actions → **Deploy** → **Run
   workflow**). The workflow takes ~3–5 minutes. You can watch live under
   "Actions"; on a failure it says exactly which step failed.
2. Open `https://sequenz.io` — the site is running. Measurement is still off
   because `UMAMI_WEBSITE_ID` is empty. That is expected.
3. Open `https://stats.sequenz.io` → log in with **`admin`** / **`umami`** →
   **change the password immediately** (top right → Profile → Change
   password). This matters: the page is publicly reachable and the default
   credentials are common knowledge.
4. There go to **Settings → Websites → Add website**: name `sequenz.io`,
   domain `sequenz.io`. After saving, copy the **website ID** (a UUID like
   `b4f2c1a8-…`).
5. Enter that ID in GitHub: Settings → Environments → `prod` → edit
   `UMAMI_WEBSITE_ID` → paste → save.
6. **Start the deploy again**: Actions → Deploy → Run workflow. Only this
   build bakes the ID into the frontend.
7. Open the website, click around a bit — entries such as `cv_download`,
   `booking_click` and `project_open` should show up under "Events" in the
   Umami dashboard shortly afterwards.

---

## Part C — Operations

**Viewing statistics:** open `https://stats.sequenz.io` in the browser.

**Normal update:** commit the change, push to `main` — done. The deploy runs
automatically.

**Rollback:** on the VPS, in `/opt/stacks/homepage`, temporarily set the image
tag in `docker-compose.yml` to an earlier commit
(`ghcr.io/nikita-petrich/homepage:<commit-sha>`) and run
`docker compose up -d`. Cleaner for anything permanent: revert the faulty
commit in Git and push.

**Viewing logs:**

```bash
cd /opt/stacks/homepage
docker compose logs -f homepage     # or: umami, umami-db
docker compose ps                   # status of all containers
```

**Changing secrets:** overwrite the value in the `prod` environment and let
the deploy run. **Careful with `UMAMI_DB_PASSWORD`:** PostgreSQL does not
adopt a new password automatically for a database that already exists — you
have to set it there as well:

```bash
docker exec -it umami-db \
  psql -U umami -c "ALTER USER umami WITH PASSWORD 'new-value';"
```

**Backup:** the website itself is stateless (everything lives in Git). The
only thing you have to back up is the analytics database:

```bash
docker exec umami-db pg_dump -U umami umami > umami-backup-$(date +%F).sql
```

**When something does not work:**

| Symptom | Likely cause |
|---|---|
| Deploy fails at "Set up SSH" | `VPS_SSH_KEY` copied incompletely (BEGIN/END lines missing) or `VPS_HOST` wrong |
| Deploy fails at "Pull and restart" | Deploy user not in the `docker` group, or GHCR login missing for a private package |
| `docker compose up` reports "network edge not found" | The external network `edge` does not exist — `docker network create edge` (step 4c) |
| Proxy returns 502 for sequenz.io | Container `homepage` is not running, or the `SITES` entry points at the wrong name/port (`homepage:3000`) |
| Page loads but no events in Umami | `UMAMI_WEBSITE_ID` set, but no new deploy has run (step 6.6) |
| Umami container does not start | `UMAMI_DB_PASSWORD` changed after the first start without applying it in Postgres |
