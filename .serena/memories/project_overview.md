# ProSite - Project Overview

## Purpose
ProSite is a web platform for self-service management of game bot account configurations. It allows clients to manage castle configurations with 50+ parameters, while providing administrators with full control over client accounts, templates, and system monitoring.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Admin Panel**: React 18 + TypeScript + Vite (not yet implemented)
- **Backend**: Node.js 20 + Express + TypeScript
- **Database**: SQLite (planned migration to PostgreSQL)
- **Monorepo**: pnpm workspaces + Turbo
- **Authentication**: JWT (access token 12h, refresh token 30d)
- **Containerization**: Docker Compose
- **Testing**: Vitest (planned), Playwright (planned)
- **Deployment**: Vercel (currently failing)

## Main Features
1. Client self-service portal for castle configuration
2. Admin panel for managing clients, templates, and monitoring
3. 50+ configurable parameters per castle
4. Template system for quick castle setup
5. Detailed logging and audit trail
6. Windows service integration for game bot control
7. Email notifications for account management

## Development Status (2025-07-23)
- ✅ Basic authentication and client portal implemented
- ✅ Database schema and seed data ready
- 🚧 Vercel deployment failing due to monorepo complexity
- ❌ Admin interface not implemented
- ❌ No tests written yet
- ❌ Email and Windows service integration pending