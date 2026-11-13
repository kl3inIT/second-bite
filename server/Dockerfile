# syntax=docker/dockerfile:1.7
# Build from server/: docker build -t second-bite-server server. The migrations are embedded in the binary.

FROM golang:1.27.3-trixie@sha256:d9fa6e7ba43678ee1e5d1617007db9a134612032a74e2d86b44a9f582f1564cc AS build

WORKDIR /workspace/server
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY . ./
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/secondbite ./cmd/secondbite

# Distroless: no shell and no package manager; the health check is the binary's own command.
FROM gcr.io/distroless/static-debian13:nonroot@sha256:aafe993665bf6200db38a02c11a9351e782a84b6a45e7f33b6695638c88e3931

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="Second Bite Server" \
      org.opencontainers.image.source="https://github.com/kl3inIT/second-bite" \
      org.opencontainers.image.revision="${VCS_REF}"

COPY --from=build /out/secondbite /usr/local/bin/secondbite

# The database URL and secrets are set where the image runs; secrets are files under /run/secrets.
ENV SECONDBITE_HTTP_ADDR=:8080 \
    SECONDBITE_LOG_FORMAT=json

USER nonroot
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 CMD ["secondbite", "health"]
ENTRYPOINT ["secondbite"]
CMD ["serve"]
