# ProSite - Code Style and Conventions

## TypeScript Configuration
- Strict mode enabled
- ES2022 target
- Module resolution: Node
- Type imports preferred: `import type { ... }`
- No explicit any allowed
- Unused variables must start with underscore

## Code Formatting (Prettier)
- Semicolons: always
- Single quotes for strings
- Trailing comma: ES5
- Print width: 80 characters
- Tab width: 2 spaces
- Arrow function parentheses: always
- End of line: LF

## ESLint Rules
- TypeScript recommended rules enforced
- Prettier integration for formatting
- No console.log (only console.warn/error allowed)
- Consistent type imports required
- Function return types can be implicit

## File Organization
- Monorepo structure with pnpm workspaces
- Apps in `/apps` directory
- Shared packages in `/packages` directory
- Each package has its own tsconfig.json
- Turbo for build orchestration

## Naming Conventions
- Files: kebab-case (e.g., `auth-service.ts`)
- React components: PascalCase files and exports
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces/Types: PascalCase with prefix (e.g., `IUser`, `TApiResponse`)

## React Conventions
- Functional components only
- Custom hooks in `hooks/` directory
- Components in `components/` directory
- Pages/views in `pages/` or `views/` directory
- Tailwind CSS for styling

## Backend Conventions
- Services in `services/` directory
- Controllers in `controllers/` directory
- Middleware in `middleware/` directory
- Routes grouped by resource
- Error handling with custom error classes
- Async/await preferred over callbacks

## Testing Conventions
- Test files alongside source with `.test.ts` or `.spec.ts`
- Vitest for unit tests (planned)
- Playwright for E2E tests (planned)
- Minimum 80% coverage target

## Git Conventions
- Conventional commits preferred
- Pre-commit hooks with Husky
- Lint-staged for automatic formatting
- Branch naming: `feature/`, `fix/`, `chore/`