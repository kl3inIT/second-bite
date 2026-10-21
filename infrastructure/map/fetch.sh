#!/usr/bin/env bash
# Fetches the map the web draws a store's pin on (SEC-66) into DIR, which the `map` service serves as /map/:
#   DIR/hanoi.pmtiles                 Hanoi from Protomaps' daily OpenStreetMap build, zoom 0 to 15 (about 43 MB)
#   DIR/fonts/<font stack>/<range>.pbf the Noto Sans glyphs the style names
#   DIR/sprites/v4/light[@2x].{json,png} the light flavor's icons
# It needs bash, curl, tar and the go-pmtiles CLI (`pmtiles`, or PMTILES=/path/to/it), from
# https://github.com/protomaps/go-pmtiles/releases. Run it again to refresh the map: each file is written beside its
# old self and moved into place, so the service never serves half a file, and the browser reloads a changed archive
# from its new ETag.
#   infrastructure/map/fetch.sh .tmp/map                      # a workstation, for compose.local.yaml
#   sudo infrastructure/map/fetch.sh /apps/secondbite-staging/map  # the staging host (docs/runbooks/ci-cd.md)
set -euo pipefail

dir=${1:?usage: fetch.sh DIR}
# The Protomaps build, pinned so every environment draws the same map; a newer one is a change of this line.
build=20261021
# protomaps/basemaps-assets at a fixed commit.
assets=028c18f713baecad011301ff7a69acc39bcc2ae7
# Hanoi's box, the server's servedArea (server/internal/seller/location.go): west, south, east, north.
bbox=105.25,20.53,106.06,21.42
pmtiles=${PMTILES:-pmtiles}

command -v "$pmtiles" >/dev/null || { echo "fetch.sh: the go-pmtiles CLI is not on PATH; set PMTILES" >&2; exit 1; }

mkdir -p "$dir"
work=$(mktemp -d "$dir/.fetch.XXXXXX")
trap 'rm -rf "$work"' EXIT

"$pmtiles" extract "https://build.protomaps.com/$build.pmtiles" "$work/hanoi.pmtiles" --bbox="$bbox" --maxzoom=15
"$pmtiles" verify "$work/hanoi.pmtiles"

curl --fail --silent --show-error --location "https://codeload.github.com/protomaps/basemaps-assets/tar.gz/$assets" |
    tar --extract --gzip --directory "$work" --strip-components=1 \
        "basemaps-assets-$assets/fonts/Noto Sans Regular" \
        "basemaps-assets-$assets/fonts/Noto Sans Medium" \
        "basemaps-assets-$assets/fonts/Noto Sans Italic" \
        "basemaps-assets-$assets/fonts/OFL.txt" \
        "basemaps-assets-$assets/sprites/v4/light.json" \
        "basemaps-assets-$assets/sprites/v4/light.png" \
        "basemaps-assets-$assets/sprites/v4/light@2x.json" \
        "basemaps-assets-$assets/sprites/v4/light@2x.png"

# The archive moves last, so the glyphs and sprites it needs are already in place.
rm -rf "$dir/fonts.old" "$dir/sprites.old"
for kind in fonts sprites; do
    [[ -d "$dir/$kind" ]] && mv "$dir/$kind" "$dir/$kind.old"
    mv "$work/$kind" "$dir/$kind"
done
mv "$work/hanoi.pmtiles" "$dir/hanoi.pmtiles"
rm -rf "$dir/fonts.old" "$dir/sprites.old"
# nginx-unprivileged reads as uid 101.
chmod -R a+rX "$dir"

echo "fetch.sh: the map of build $build is in $dir"
