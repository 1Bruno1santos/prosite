# ProSite - Known Issues and Workarounds

## 1. Vercel Deployment Failure
**Issue**: Build fails on Vercel due to monorepo complexity and native dependencies
**Symptoms**: 
- "Directory not found" errors
- TypeScript declaration file errors
- Build command path issues

**Attempted Fixes**:
- Added `packageManager` field to package.json
- Removed .vercelignore
- Created multiple build scripts
- Enabled TypeScript declarations

**Current Status**: Awaiting build verification

**Alternative Solutions**:
1. Deploy frontend only (separate from monorepo)
2. Use Netlify (better monorepo support)
3. Use Railway or Render (full-stack support)
4. Containerize and deploy to Fly.io

## 2. ESLint Pre-commit Hook Failures
**Issue**: Pre-commit hooks fail on tsup.config.ts files
**Error**: "Parsing error: ESLint was configured to run on `tsup.config.ts`"

**Workaround**: 
```bash
git commit -m "message" --no-verify
```

**Permanent Fix**: Add tsup.config.ts to tsconfig.json or .eslintignore

## 3. Better-SQLite3 Native Module
**Issue**: Native module won't compile in WSL/Vercel environment
**Error**: "Could not find module root"

**Workaround**: 
- Use raw SQL scripts instead of Drizzle migrations
- Created `run-migration.ts` and `seed.sql` scripts
- Execute with sqlite3 CLI directly

**Future Solution**: Migrate to PostgreSQL

## 4. GitHub Actions Permissions
**Issue**: Workflow creation fails due to token permissions
**Error**: "Resource not accessible by integration"

**Workaround**: 
- Temporarily removed .github/workflows
- Add workflows after initial commit

## 5. Port Conflicts
**Issue**: Development servers may conflict with existing services

**Ports Used**:
- Backend: 3001
- Frontend: 3000  
- Admin: 3002
- MailHog: 8025 (UI), 1025 (SMTP)

**Fix**: Check and kill existing processes:
```bash
lsof -i :3000
kill -9 <PID>
```

## 6. Database File Permissions
**Issue**: SQLite database file may have permission issues in Docker

**Fix**: 
```bash
chmod 666 packages/database/data/prosite.db
```

## 7. Environment Variables
**Issue**: Missing .env files cause runtime errors

**Fix**: Always copy example files:
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```