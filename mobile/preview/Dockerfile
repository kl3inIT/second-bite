# syntax=docker/dockerfile:1.7
# The browser preview of the app, for the team only (docs/guidelines/mobile.md, Platforms). The Release workflow builds
# it with `flutter build web` first, with the Flutter version pubspec.yaml pins, then from mobile/:
#   docker build -f preview/Dockerfile -t second-bite-preview .
FROM nginxinc/nginx-unprivileged:1.31-alpine@sha256:378d0c32f6562f7fd9629170797f57d2b953aa09be983b3daaf4809bb039ca00

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="Second Bite Preview" \
      org.opencontainers.image.source="https://github.com/kl3inIT/second-bite" \
      org.opencontainers.image.revision="${VCS_REF}"

COPY preview/nginx.conf /etc/nginx/conf.d/default.conf
COPY build/web /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD ["wget", "--quiet", "--spider", "http://127.0.0.1:8080/"]
