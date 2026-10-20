# syntax=docker/dockerfile:1.7
# Build from web/: docker build -t second-bite-web web. Adapted from BeyondPilot's web/Dockerfile.

FROM node:26-slim@sha256:0d1e33586362bb9e608c4e751e7a9e7edb55c9ac11461ed5666af696cc461dd4 AS build

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

FROM node:26-slim@sha256:0d1e33586362bb9e608c4e751e7a9e7edb55c9ac11461ed5666af696cc461dd4

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="Second Bite Web" \
      org.opencontainers.image.source="https://github.com/kl3inIT/second-bite" \
      org.opencontainers.image.revision="${VCS_REF}"

WORKDIR /application
# The standalone output holds the server and the modules it traces; static files and the public folder (the
# Google mark of the sign-in screen) go beside it, which Next.js does not do itself.
COPY --from=build --chown=1000:1000 /workspace/web/.next/standalone ./
COPY --from=build --chown=1000:1000 /workspace/web/.next/static ./.next/static
COPY --from=build --chown=1000:1000 /workspace/web/public ./public

# SECONDBITE_API_ORIGIN, the Go server the pages render against, is set where the image runs.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER node
EXPOSE 3000
CMD ["node", "server.js"]
