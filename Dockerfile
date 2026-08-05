# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
# pnpm-workspace.yaml carries the security overrides and allowBuilds list.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Image Optimization is the one Next feature the standalone bundle cannot carry
# itself: `sharp` is the single extra runtime dependency it needs (see the
# bundled guide node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md),
# and the file tracer only follows its JavaScript — never the platform-specific
# libvips binaries in @img/*, which are resolved by a runtime dlopen. Missing
# them, /_next/image silently answers every width with the untouched source
# file, so a 1280px JPEG is served into a 358px slot at 4x the bytes.
#
# Installed here rather than traced, so the binaries are built for the runner's
# own platform (alpine/musl). The version is read from package.json, which
# declares sharp precisely so this stays a single source of truth.
FROM base AS sharp
WORKDIR /sharp
COPY package.json /tmp/app-package.json
RUN npm init -y > /dev/null \
 && npm install --no-audit --no-fund \
      "sharp@$(node -p "require('/tmp/app-package.json').dependencies.sharp")"

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined at build time — pass the Umami website ID
# as a build arg (set from the UMAMI_WEBSITE_ID repository variable in CI).
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# output: "standalone" emits a minimal server.js; public/ and .next/static
# must be copied alongside it (see the bundled Next docs on `output`).
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Replaces the JavaScript-only copy of sharp the tracer left behind with the
# complete install, @img/* binaries included. Done as an explicit merge rather
# than a COPY onto ./node_modules because the traced entry is a pnpm symlink
# and overlaying a directory onto it is not well defined.
COPY --from=sharp /sharp/node_modules /tmp/sharp-modules
RUN rm -rf node_modules/sharp node_modules/@img \
 && cp -a /tmp/sharp-modules/. node_modules/ \
 && rm -rf /tmp/sharp-modules \
 && node -e "require('sharp')" \
 && chown -R nextjs:nodejs node_modules
USER nextjs
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "server.js"]
