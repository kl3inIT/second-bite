#!/usr/bin/env bash
# Nightly backup of one environment, run by secondbite-backup.service (docs/runbooks/ci-cd.md), adapted from
# BeyondPilot's on the same host:
#
#   secondbite-backup <environment>     (staging, the only environment so far)
#
# It dumps the database, which also holds the stored files, and keeps the 14 newest dumps on the host; copying them
# off the host waits for a backup target.
set -euo pipefail
umask 077

fail() {
    echo "backup: $*" >&2
    exit 1
}

[[ $# -eq 1 ]] || fail "usage: secondbite-backup <environment>"
case "$1" in
    staging) project=secondbite-staging ;;
    *) fail "environment must be staging" ;;
esac
readonly project
readonly root="/apps/$project"
readonly backups="$root/backups"
install -d -m 0700 "$backups"

# Never alongside a deployment, which takes its own dump and may be migrating.
install -d -m 0700 "$root/deployments"
exec 9>"$root/deployments/lock"
flock --wait 600 9

stamp=$(date --utc +%Y%m%dT%H%M%SZ)
dump="$backups/nightly-$stamp.dump"
docker exec "$project-postgres" pg_dump --username=secondbite --dbname=secondbite --format=custom >"$dump.partial"
docker exec --interactive "$project-postgres" pg_restore --list <"$dump.partial" >/dev/null
mv "$dump.partial" "$dump"

find "$backups" -maxdepth 1 -name 'nightly-*Z.dump' -printf '%T@ %p\n' | sort --numeric-sort --reverse |
    tail --lines=+15 | cut --delimiter=' ' --fields=2- | xargs --no-run-if-empty rm -f --
echo "backup: $project saved to $dump"
