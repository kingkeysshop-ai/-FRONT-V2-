FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
RUN corepack enable && corepack prepare pnpm@11 --activate
RUN pnpm install --ignore-scripts

FROM base AS builder
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ENV NODE_ENV=production
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && corepack prepare pnpm@11 --activate
RUN pnpm rebuild sharp 2>/dev/null; pnpm build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nextjs
EXPOSE 8000

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=8000

CMD ["node_modules/.bin/next", "start", "-p", "8000"]
