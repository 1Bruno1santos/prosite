# ProSite - Task Completion Checklist

## Before Marking a Task as Complete

### 1. Code Quality
- [ ] Code follows TypeScript conventions
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No console.log statements (except for debugging)

### 2. Testing
- [ ] Unit tests written for new functions/services
- [ ] Integration tests for API endpoints
- [ ] All tests passing (`pnpm test`)
- [ ] Edge cases covered

### 3. Documentation
- [ ] JSDoc comments for public APIs
- [ ] README updated if needed
- [ ] CHANGELOG entry added
- [ ] API documentation updated (if applicable)

### 4. Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React handles this mostly)
- [ ] CSRF protection for state-changing operations

### 5. Performance
- [ ] No N+1 queries
- [ ] Appropriate indexes on database
- [ ] Bundle size checked (for frontend)
- [ ] Lighthouse score >= 95 (for frontend)

### 6. Git/Version Control
- [ ] Meaningful commit messages
- [ ] No merge conflicts
- [ ] Branch up to date with main
- [ ] PR description includes what/why/how

### 7. Deployment Readiness
- [ ] Environment variables documented
- [ ] Build succeeds (`pnpm build`)
- [ ] Docker build succeeds (if applicable)
- [ ] Migration scripts ready (if DB changes)

## Known Issues to Check
1. ESLint may fail on tsup.config.ts files - use `--no-verify` if needed
2. Better-SQLite3 native module issues in WSL - use SQL scripts directly
3. Vercel deployment failing - check build logs for monorepo issues