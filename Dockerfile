FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY next.config.ts tsconfig.json postcss.config.cjs tailwind.config.cjs eslint.config.mjs ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
