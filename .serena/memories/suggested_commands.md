# ProSite - Suggested Commands

## Development Commands
```bash
# Install dependencies
pnpm install

# Run in development mode (all apps)
pnpm dev

# Build for production
pnpm build
# or with Turbo
turbo run build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck

# Clean all build artifacts and node_modules
pnpm clean
```

## Database Commands
```bash
# Run migrations
cd packages/database && npx tsx src/run-migration.ts

# Seed database
cd packages/database && sqlite3 data/prosite.db < src/seed.sql

# Check database tables
sqlite3 packages/database/data/prosite.db ".tables"

# View data
sqlite3 packages/database/data/prosite.db "SELECT * FROM clients;"
```

## Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

## Git Commands
```bash
# Commit without pre-commit hooks (when ESLint fails)
git commit -m "message" --no-verify

# Push to GitHub
git push origin master
```

## Package-specific Commands
```bash
# Build individual packages
pnpm --filter @prosite/shared build
pnpm --filter @prosite/ui build
pnpm --filter @prosite/frontend build

# Run specific app in dev mode
pnpm --filter @prosite/backend dev
pnpm --filter @prosite/frontend dev
pnpm --filter @prosite/admin dev
```

## Debugging Commands
```bash
# View file structure
find . -type f -name "*.json" | grep -E "(package|tsconfig)" | sort

# Check dependencies
pnpm ls --depth=0

# Verbose build
VERBOSE=1 pnpm build

# Test Vercel build locally
npx vercel build

# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## System Utilities (Linux/WSL)
- `ls -la` - List files with details
- `cd` - Change directory
- `pwd` - Print working directory
- `grep -r "pattern" .` - Search for pattern in files
- `find . -name "*.ts"` - Find TypeScript files
- `tail -f file.log` - Follow log file updates
- `ps aux | grep node` - List Node.js processes
- `lsof -i :3000` - Check what's using port 3000