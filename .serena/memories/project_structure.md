# ProSite - Project Structure

## Repository Layout
```
prosite/
├── apps/                      # Application packages
│   ├── admin/                 # Admin dashboard (React + Vite)
│   ├── backend/               # API server (Express + TypeScript)
│   └── frontend/              # Client portal (React + Vite)
├── packages/                  # Shared packages
│   ├── database/              # Database schema, migrations, seed
│   ├── shared/                # Shared types and utilities
│   └── ui/                    # Shared UI components
├── infrastructure/            # Docker and deployment configs
│   ├── docker/
│   └── k8s/
├── scripts/                   # Build and utility scripts
├── docs/                      # Documentation
└── .github/                   # GitHub Actions workflows

## Key Files
- `package.json` - Root monorepo configuration
- `pnpm-workspace.yaml` - Workspace configuration
- `turbo.json` - Turbo build configuration
- `tsconfig.base.json` - Base TypeScript config
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `docker-compose.yml` - Docker services
- `vercel.json` - Vercel deployment config
- `CLAUDE.md` - AI assistant instructions

## Package Details

### @prosite/backend
- Express server with TypeScript
- JWT authentication
- RESTful API
- Database connection with Drizzle ORM
- Email service (nodemailer)
- Windows service integration

### @prosite/frontend
- React 18 with Vite
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation
- Axios for API calls

### @prosite/admin
- Similar stack to frontend
- Admin-specific features
- Not yet implemented

### @prosite/database
- SQLite with Drizzle ORM
- Migration scripts
- Seed data
- Schema definitions

### @prosite/shared
- TypeScript type definitions
- Shared utilities
- Constants and enums
- Validation schemas

### @prosite/ui
- Shared React components
- Design system components
- Tailwind configurations