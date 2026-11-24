# Stage 1: Build
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npm run build

# Stage 2: Runtime
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Railway injects PORT automatically.
# Set DB_PATH and JWT_SECRET as Railway environment variables.
EXPOSE 8080

CMD ["node", "dist/main.js"]
