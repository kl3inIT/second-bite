# syntax=docker/dockerfile:1.7
# Build from server/: docker build -t second-bite-server server. The migrations are embedded in the binary.

FROM golang:1.27.2-trixie@sha256:47667934874913a449b96faa7ef4777fa285d9ec29126ee80ed61c45b7cccf0e AS build

WORKDIR /workspace/server
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY . ./
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/secondbite ./cmd/secondbite

# Distroless: no shell and no package manager; the health check is the binary's own command.
FROM gcr.io/distroless/static-debian13:nonroot@sha256:18f4cc26c9ffa7f20a359298be7deadac5c607c8e03a02b8119f1a5fc2f82c99

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
