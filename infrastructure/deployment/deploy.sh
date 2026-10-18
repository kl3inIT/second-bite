#!/usr/bin/env bash
# Rolls a verified release out to one environment of the shared host (docs/runbooks/ci-cd.md). The Deploy workflow
# uploads this script, the compositions and images.env to <root>/incoming/<release>/ and runs it under a sudo rule of
# the deployment user:
#
#   sudo -n bash <root>/incoming/<release>/deploy.sh <environment> <release> <actor>   (registry token on standard input)
#
# <environment> is staging, the only environment so far; it selects the directory, the Compose project, the
# containers, the environment file and the overlay, so environments never touch each other. <release> is
# <source SHA>-<Release run>-<attempt>. Adapted from BeyondPilot's deploy.sh, which runs on the same host.
# Nothing here rolls back on its own: a failure leaves the database backup and the previous release recorded for an
# operator.
set -euo pipefail
umask 077

fail() {
    echo "deploy: $*" >&2
    exit 1
}

[[ $# -eq 3 ]] || fail "usage: deploy.sh <environment> <release> <actor>"
environment=$1
case "$environment" in
    staging) project=secondbite-staging ;;
    *) fail "environment must be staging" ;;
esac
readonly environment project
readonly root="/apps/$project"
readonly env_file="$root/.env.$environment"
readonly deployments="$root/deployments"
readonly backups="$root/backups"

release=$2
actor=$3
[[ "$release" =~ ^([0-9a-f]{40})-[1-9][0-9]*-[1-9][0-9]*$ ]] || fail "release must be <sha>-<run>-<attempt>"
sha=${BASH_REMATCH[1]}
[[ "$actor" =~ ^[A-Za-z0-9][A-Za-z0-9-]*(\[bot\])?$ ]] || fail "actor is not a GitHub login"
incoming="$root/incoming/$release"

# One deployment at a time; a second one fails instead of waiting behind the first.
install -d -m 0700 "$deployments" "$backups"
exec 9>"$deployments/lock"
flock --nonblock 9 || fail "another deployment holds the lock"

# The environment file is the only input the host adds, so it must be exactly what the runbook provisions.
[[ -f "$env_file" && ! -L "$env_file" ]] || fail "$env_file is missing or a symlink"
[[ "$(stat --format '%u %a' "$env_file")" == "0 600" ]] || fail "$env_file must be owned by root with mode 0600"

# Compose mounts these into the containers; a missing one would stop the rollout halfway.
for secret in database-password email-settings-key sign-in-code-key; do
    [[ -s "$root/secrets/$secret" ]] || fail "secret file $root/secrets/$secret is missing or empty"
done

for file in images.env compose.base.yaml "compose.$environment.yaml"; do
    [[ -f "$incoming/$file" && ! -L "$incoming/$file" ]] || fail "$incoming/$file is missing"
done

# images.env is read as data, never sourced.
release_value() {
    local value
    value=$(grep --max-count=1 "^$1=" "$incoming/images.env" | cut --delimiter='=' --fields=2-) || true
    printf '%s' "$value"
}
server_image=$(release_value SECONDBITE_SERVER_IMAGE)
web_image=$(release_value SECONDBITE_WEB_IMAGE)
[[ "$(release_value SECONDBITE_SOURCE_SHA)" == "$sha" ]] || fail "images.env names another revision"
[[ "$server_image" =~ ^ghcr\.io/kl3init/second-bite-server@sha256:[0-9a-f]{64}$ ]] || fail "unexpected server image"
[[ "$web_image" =~ ^ghcr\.io/kl3init/second-bite-web@sha256:[0-9a-f]{64}$ ]] || fail "unexpected web image"

# The workflow's short-lived token pulls the private images; its credential file goes when this script exits.
registry_token=$(cat)
[[ -n "$registry_token" ]] || fail "no registry token on standard input"
DOCKER_CONFIG=$(mktemp --directory)
export DOCKER_CONFIG
trap 'rm -rf -- "$DOCKER_CONFIG"' EXIT
printf '%s' "$registry_token" | docker login ghcr.io --username "$actor" --password-stdin >/dev/null
unset registry_token
for image in "$server_image" "$web_image"; do
    docker pull --quiet "$image" >/dev/null
    revision=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image")
    [[ "$revision" == "$sha" ]] || fail "$image was built from $revision, not $sha"
done
docker logout ghcr.io >/dev/null

compose=(docker compose --project-name "$project"
    --env-file "$env_file" --env-file "$incoming/images.env"
    --file "$incoming/compose.base.yaml" --file "$incoming/compose.$environment.yaml")
"${compose[@]}" config --quiet

# Before the server migrates a database that holds data, stop the writer and keep a dump that pg_restore can read.
if [[ "$(docker inspect --format '{{.State.Running}}' "$project-postgres" 2>/dev/null || true)" == true ]]; then
    "${compose[@]}" stop server
    dump="$backups/pre-deploy-$release.dump"
    docker exec "$project-postgres" pg_dump --username=secondbite --dbname=secondbite --format=custom >"$dump"
    docker exec --interactive "$project-postgres" pg_restore --list <"$dump" >/dev/null
    echo "deploy: database saved to $dump"
fi

# PostgreSQL first, then the server (it migrates as it starts), then the web once the server is healthy.
"${compose[@]}" up --detach --wait --wait-timeout 300 --remove-orphans

for container in "$project-server" "$project-web"; do
    revision=$(docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$container")
    [[ "$revision" == "$sha" ]] || fail "$container runs $revision, not $sha"
done

# The accepted release, and the one before it as the target of a manual rollback.
if [[ -f "$deployments/current.env" ]]; then
    cp "$deployments/current.env" "$deployments/previous.env"
fi
{
    cat "$incoming/images.env"
    printf 'SECONDBITE_RELEASE=%s\nSECONDBITE_DEPLOYED_BY=%s\nSECONDBITE_DEPLOYED_AT=%s\n' \
        "$release" "$actor" "$(date --utc +%Y-%m-%dT%H:%M:%SZ)"
} >"$deployments/current.env"

# Keep the bundles of the current and previous releases and the five newest pre-deployment dumps.
# The first deployment has no previous.env, so only the records that exist are read.
keep=""
for record in "$deployments/current.env" "$deployments/previous.env"; do
    if [[ -f "$record" ]]; then
        keep+="$(sed --quiet 's/^SECONDBITE_RELEASE=//p' "$record")"$'\n'
    fi
done
for directory in "$root"/incoming/*/; do
    name=$(basename "$directory")
    grep --quiet --fixed-strings --line-regexp "$name" <<<"$keep" || rm -rf -- "$directory"
done
find "$backups" -maxdepth 1 -name 'pre-deploy-*.dump' -printf '%T@ %p\n' | sort --numeric-sort --reverse |
    tail --lines=+6 | cut --delimiter=' ' --fields=2- | xargs --no-run-if-empty rm -f --

# Keep the images of the current and previous releases and remove older Second Bite images. Only images of this
# repository are named: never prune, which would act on the other products of the host.
keep_images=$(sed --quiet 's/^SECONDBITE_\(SERVER\|WEB\)_IMAGE=//p' "$deployments/current.env" "$deployments/previous.env" 2>/dev/null || true)
docker image ls --digests --format '{{.Repository}}@{{.Digest}} {{.ID}}' |
    grep --extended-regexp '^ghcr\.io/kl3init/second-bite-(server|web)@sha256:' |
    while read -r reference id; do
        grep --quiet --fixed-strings --line-regexp "$reference" <<<"$keep_images" ||
            docker image rm "$id" >/dev/null 2>&1 || true
    done || true

echo "deploy: $release is running on $environment"
