FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy shared packages
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

# This will be overridden by volume mount
RUN mkdir -p apps/frontend apps/admin

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages
RUN pnpm --filter @prosite/shared build
RUN pnpm --filter @prosite/ui build || true

EXPOSE 3000

CMD ["pnpm", "dev"]