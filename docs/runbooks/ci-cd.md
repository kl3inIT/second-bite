# Releases and delivery to staging

Second Bite deploys the way BeyondPilot already deploys to the same host (its `docs/runbooks/ci-cd.md`). The flow:

1. [Release](../../.github/workflows/release.yml) turns a `main` push into a release.
2. [Deploy staging](../../.github/workflows/deploy-staging.yml) calls the shared [Deploy](../../.github/workflows/deploy.yml) workflow.
3. Deploy runs [`deploy.sh`](../../infrastructure/deployment/deploy.sh) on the host over SSH.

The reasons, and the alternatives considered (Kamal, Docker contexts over SSH, Coolify), are in the [SEC-33 design](../increments/active/sec-33-staging/design.md).

A green deployment means the release is running and healthy. It does not claim that the product works; the team checks that on the site.

## Releases

`main` receives only commits whose checks passed on their branch. A `main` push that changes `server/`, `web/`, `mobile/` or `infrastructure/deployment/` starts Release:

1. **Server image, Web image and Preview image** build side by side; the first two use the GitHub Actions layer cache, and the preview builds the Flutter app for the browser with the version `mobile/pubspec.yaml` pins. Each pushes to GHCR as `ghcr.io/kl3init/second-bite-{server,web,preview}:sha-<sha>-<run>-<attempt>`. A tag names one attempt and is never moved; there is no `latest`.
2. **Start together and exercise the routes** pulls both images by digest and starts them with PostgreSQL behind the local proxy (`compose.local.yaml`, `--no-build`). It then checks:
   - `/vi` and `/robots.txt` answer 200;
   - `/api/readyz` answers 204;
   - `/api/offers` answers 200;
   - the preview answers any path with the app and `X-Robots-Tag: noindex`;
   - each image's `revision` label is the commit.
3. **Publish release** runs only after the step above passes. It uploads the artifact `release-<sha>`, kept 30 days, holding `images.env`: the source SHA and both images by digest.

[Clean up images](../../.github/workflows/ghcr-cleanup.yml) keeps the ten newest versions of each image on GHCR, after every Release and weekly. Deploy accepts nothing else. An image that a failed run pushed is named by no `images.env`, so it is never deployed. A push that changes only documents makes no release and leaves staging as it is.

## Deployment

| Environment | Address | Deployed |
| --- | --- | --- |
| Staging | `https://secondbite.vadan.app`; the Flutter browser preview at `https://preview.secondbite.vadan.app` | After every successful Release run when the repository variable `STAGING_AUTO_DEPLOY` is `true`, and by hand at any time |

There is no production yet; it is added when its address and host are chosen ([vision](../vision.md)).

To deploy by hand:

```text
gh workflow run deploy-staging.yml --ref main -f ci_run_id=<successful main Release run>
gh run watch <deployment run> --exit-status
```

Deploy does the following:

1. **Checks the run.** The Release run must be a successful push to `main` of this repository, and its `Publish release` job must have passed. An automatic run stops there if a newer Release run of `main` exists, because that release deploys after its own run.
2. **Uploads the release.** It checks out that commit and downloads its `images.env`. It copies that file, `deploy.sh`, `compose.base.yaml` and `compose.staging.yaml` to `/apps/secondbite-staging/incoming/<release>/` over SSH, with:
   - a pinned host key;
   - the staging deployment key, which exists only for the duration of the job;
   - the runner's own `ssh`, not a third-party SSH action.
3. **Runs the script.** It runs `deploy.sh staging <release> <actor>` under the deployment user's one sudo rule, and passes the job's package-read token on standard input.

`deploy.sh` does the following:

- **Refuses bad input:**
  - takes the environment's lock;
  - refuses a malformed release;
  - refuses an environment file that is not root's with mode `0600`;
  - refuses a missing secret file.
- **Checks the images:** pulls both images and checks that their `revision` label is the release's SHA.
- **Saves the database:** when a database is running, stops the server and saves a `pg_dump` that `pg_restore --list` can read, to `backups/pre-deploy-<release>.dump`.
- **Starts the composition** with `up --wait`: PostgreSQL first, then the server, which migrates as it starts, then the web once the server is healthy.
- **Records the release:** checks the running revisions and writes the release to `deployments/current.env`, and the one before it to `previous.env`.
- **Removes old images:** removes every Second Bite image except those of the current and previous releases. It never prunes, which would remove BeyondPilot's and MemoryOS's images too.

The site is down for the few seconds the server takes to restart and migrate. There is no zero-downtime rollout.

## The host

Staging runs on the host of BeyondPilot's staging, which also runs MemoryOS's production; `beyondpilot.vadan.app` resolves to it. Second Bite has its own:
- directory;
- Compose project, `secondbite-staging`;
- containers, `secondbite-staging-{postgres,server,web,preview}`;
- volume and internal network.

It shares the host's Nginx Proxy Manager, which it reaches through the existing external network `proxy-network`. Never change a container, file or setting of BeyondPilot or MemoryOS from here.

Under `/apps/secondbite-staging`:

| Path | Owner, mode | Holds |
| --- | --- | --- |
| `incoming` | `secondbite-ci`, `0700` | One directory per uploaded release; `deploy.sh` keeps the current and previous ones |
| `deployments` | root, `0700` | `lock`, `current.env`, `previous.env` |
| `backups` | root, `0700` | Pre-deployment dumps (the five newest) and nightly dumps (the 14 newest) |
| `secrets` | root, `0700` | `database-password`, `email-settings-key` and `sign-in-code-key`, each owned by uid 65532 (the server's distroless `nonroot` user) with mode `0400` |
| `.env.staging` | root, `0600` | The non-secret values of [`staging.env.example`](../../infrastructure/deployment/staging.env.example) |

### Provision the host once

**DNS.** In the `vadan.app` zone, which is managed at Hostinger:
- `A secondbite` points to the host;
- `A preview.secondbite` points to the host too, for the Flutter browser preview (SEC-35).

**The host.** In a session as an administrator of the host, create the deployment user and the directories. The user has no password, is not in the `docker` group, and has one sudo rule. It needs a home directory: `--system` alone gives it `/nonexistent`, and SSH then finds no `authorized_keys`.

```sh
sudo adduser --system --group --home /home/secondbite-ci --shell /bin/bash secondbite-ci
sudo chmod 0750 /home/secondbite-ci
root=/apps/secondbite-staging
sudo install -d -o root -g root -m 0755 "$root"
sudo install -d -o secondbite-ci -g secondbite-ci -m 0700 "$root/incoming"
sudo install -d -o root -g root -m 0700 "$root/deployments" "$root/backups" "$root/secrets"
echo 'secondbite-ci ALL=(root) NOPASSWD: /usr/bin/bash /apps/secondbite-staging/incoming/*/deploy.sh *' |
  sudo tee /etc/sudoers.d/secondbite-ci >/dev/null
sudo chmod 0440 /etc/sudoers.d/secondbite-ci && sudo visudo -c
```

A deployment key can upload a script that sudo then runs, so it carries root on this host. Create a new key pair for staging; never reuse BeyondPilot's. Give its `authorized_keys` line `restrict`, so it opens no forwarding or terminal:

```sh
sudo install -d -o secondbite-ci -g secondbite-ci -m 0700 /home/secondbite-ci/.ssh
echo 'restrict <public key of the staging deployment key>' |
  sudo tee /home/secondbite-ci/.ssh/authorized_keys >/dev/null
sudo chown secondbite-ci:secondbite-ci /home/secondbite-ci/.ssh/authorized_keys
sudo chmod 0600 /home/secondbite-ci/.ssh/authorized_keys
```

**Secrets.** Generate them on the host and never print them:

```sh
cd /apps/secondbite-staging/secrets
sudo sh -c 'umask 077; openssl rand -hex 32 > database-password'
sudo sh -c 'umask 077; openssl rand -base64 32 > email-settings-key'
sudo sh -c 'umask 077; openssl rand -base64 32 > sign-in-code-key'
sudo chown 65532:65532 database-password email-settings-key sign-in-code-key
sudo chmod 0400 database-password email-settings-key sign-in-code-key
sudo install -m 0600 /dev/null /apps/secondbite-staging/.env.staging
```

What each secret does ([backend runbook](backend.md)):
- `database-password` sets the password only when PostgreSQL first creates its data directory. Changing the file later does not change the database.
- Replacing `email-settings-key` makes the stored email provider key unreadable until an admin enters it again.
- Replacing `sign-in-code-key` voids the codes sent in the last 15 minutes.

**The nightly backup.** Install it from a checkout of this repository:

```sh
sudo install -m 0755 infrastructure/backup/backup.sh /usr/local/sbin/secondbite-backup
sudo install -m 0644 infrastructure/backup/systemd/secondbite-backup.{service,timer} /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now secondbite-backup.timer
```

It dumps the database, which also holds the stored files, at 01:55 UTC+7. That is between BeyondPilot's backup (01:40) and MemoryOS's (02:10). The dumps stay on this host until an off-host backup target is chosen.

**After the first deployment.** Make the first admin and choose who delivers email with the server's own commands ([backend runbook](backend.md)):

```sh
sudo docker exec -it secondbite-staging-server secondbite admin grant <address>
sudo docker exec -it secondbite-staging-server secondbite email configure ...
```

The grant is refused with `IDENTITY_ADDRESS_UNPROVEN` when someone has already signed in with Google to that address and Google does not speak for it (an address outside `gmail.com` and Google Workspace); the address's owner signs in once with the emailed code, which removes that link, and the grant then succeeds.

**Signing in with Google.** Put the web client's ID in `.env.staging` as `SECONDBITE_GOOGLE_CLIENT_IDS=<client ID>` (`sudoedit /apps/secondbite-staging/.env.staging`), then restart the server with the release that is running. Deploy staging refuses a release it has already uploaded, so recreate the server with the same files `deploy.sh` used:

```sh
root=/apps/secondbite-staging
release=$(sudo sed --quiet 's/^SECONDBITE_RELEASE=//p' "$root/deployments/current.env")
sudo docker compose --project-name secondbite-staging --env-file "$root/.env.staging"   --env-file "$root/incoming/$release/images.env" --file "$root/incoming/$release/compose.base.yaml"   --file "$root/incoming/$release/compose.staging.yaml" up --detach --wait server
```

Later deployments read the same `.env.staging`, so the value stays. The client is of type "Web application", with `https://secondbite.vadan.app` among its authorised JavaScript origins and no redirect URI: the web takes Google's ID token in a popup. While its consent screen is in testing mode, only its test users can sign in. Its client secret is not used anywhere; keep it out of the host. An empty value leaves Google off, and `GET /api/auth/methods` then answers `{}`.

Then record the date of that first deployment in the [persistence guideline](../guidelines/persistence.md). From that date on, migrations are forward-only.

### The reverse proxy

Create a proxy host in Nginx Proxy Manager with these settings:
- domain `secondbite.vadan.app`;
- forwards to `http://secondbite-staging-web:3000`;
- a Let's Encrypt certificate, Force SSL, HTTP/2 and Block Common Exploits.

Then add the advanced configuration below.
- **Upstream as a variable.** The browser sees one origin, and `/api/` goes to the Go server without its prefix. The upstream is a variable, so nginx resolves it per request and the host keeps working while the container is being replaced, as on BeyondPilot.
- **Client address.** The proxy is the edge, so it sets `X-Forwarded-For` itself and drops `Forwarded`. A value the client wrote would otherwise be read as its address.

```nginx
client_max_body_size 12m;

location /api/ {
    set $secondbite_server secondbite-staging-server;
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://$secondbite_server:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header Forwarded "";
    proxy_set_header X-Real-IP $remote_addr;
}
```

Staging's proxy host is id 10, and its certificate is id 11, renewed by Nginx Proxy Manager.

Nginx Proxy Manager 2.13 takes the Let's Encrypt address from its own settings. A certificate requested through its API carries only `{"dns_challenge": false}` in `meta`; it refuses `letsencrypt_agree` or `letsencrypt_email`.

The admin credentials kept at `/apps/proxy/admin-credentials.txt` were out of date on 18 October 2026. Staging's host was therefore created through the API, with an admin token valid ten minutes and signed inside the container with the proxy's own key (`/data/keys.json`). The token was never printed, and no password was changed.

Staging is never indexed: the web answers `robots.txt` with `Disallow: /`.

### GitHub configuration

| Where | Name | Value |
| --- | --- | --- |
| Environment `staging`, deployment branches limited to `main` | variable `STAGING_HOST` | The host's address, the one `beyondpilot.vadan.app` resolves to |
| | variable `STAGING_USER` | `secondbite-ci` |
| | variable `STAGING_KNOWN_HOSTS` | The host's `ssh-ed25519` key, read over an SSH connection already trusted |
| | secret `STAGING_SSH_KEY` | The private half of the staging deployment key |
| Repository | variable `STAGING_AUTO_DEPLOY` | `true` to deploy after every successful Release run; unset for manual deployment only |

## Failure and recovery

A failed or cancelled deployment rolls nothing back. The job summary says it did not finish; the host keeps the pre-deployment dump and `deployments/previous.env`. Read the state as root:

```sh
cd /apps/secondbite-staging
cat deployments/current.env deployments/previous.env
docker compose --project-name secondbite-staging ps
docker logs --tail 200 secondbite-staging-server
```

- **The release is bad, and its migrations changed nothing:** deploy the previous release again. Dispatch Deploy staging with the Release run named in `previous.env` (`SECONDBITE_RELEASE` is `<sha>-<run>-<attempt>`).
- **A migration ran:** fix forward with a new release. Or restore the dump taken before the deployment, then deploy the previous release. Restoring discards every write made after the dump.

  ```sh
  docker compose --project-name secondbite-staging stop server web
  docker exec --interactive secondbite-staging-postgres pg_restore --username=secondbite --dbname=secondbite --clean --if-exists \
    < backups/pre-deploy-<release>.dump
  ```

Never run `docker system prune` or `docker volume prune` on this host: they act on BeyondPilot and MemoryOS as well.
