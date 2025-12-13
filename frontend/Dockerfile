FROM node:20-alpine AS builder

WORKDIR /app

# Copy all source files first
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY next-env.d.ts ./
COPY src ./src
COPY public ./public

# Install dependencies
RUN npm ci

# Build args
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Start the application
EXPOSE 3000
CMD ["node", "server.js"]

