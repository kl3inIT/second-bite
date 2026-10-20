# syntax=docker/dockerfile:1.7
# Build from web/: docker build -t second-bite-web web. Adapted from BeyondPilot's web/Dockerfile.

FROM node:24-slim@sha256:a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5 AS build

# pnpm at the version package.json records, installed directly rather than through Corepack.
RUN npm install --global pnpm@12.14.0

WORKDIR /workspace/web
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tools/openapi/package.json ./tools/openapi/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# The generated API client and tokens.css are committed, so the build reads neither api/ nor DESIGN.md.
COPY . ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:24-slim@sha256:a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="Second Bite Web" \
      org.opencontainers.image.source="https://github.com/kl3inIT/second-bite" \
      org.opencontainers.image.revision="${VCS_REF}"

WORKDIR /application
# The standalone output holds the server and the modules it traces; static files go beside it.
COPY --from=build --chown=1000:1000 /workspace/web/.next/standalone ./
COPY --from=build --chown=1000:1000 /workspace/web/.next/static ./.next/static

# SECONDBITE_API_ORIGIN, the Go server the pages render against, is set where the image runs.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER node
EXPOSE 3000
CMD ["node", "server.js"]
