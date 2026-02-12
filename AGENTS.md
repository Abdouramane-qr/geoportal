# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Laravel backend code (controllers, services, models, policies, requests).
- `resources/js/`: React + TypeScript frontend (pages, components, hooks, `features/map`, `landing`).
- `resources/css/`: Tailwind/CSS entrypoints.
- `routes/`: HTTP and settings route definitions.
- `database/`: migrations, seeders, factories, and SQL assets.
- `tests/`: backend PHPUnit tests split into `tests/Feature` and `tests/Unit`; frontend tests in `resources/js/landing/tests`.
- `public/`: static assets and Vite build output targets.

## Build, Test, and Development Commands
- `composer run setup`: install PHP/Node deps, create env file, generate app key, migrate DB, and build assets.
- `composer run dev`: run Laravel server, queue worker, logs (`pail`), and Vite dev server concurrently.
- `npm run dev`: frontend-only Vite dev server.
- `npm run build` or `npm run build:ssr`: production bundle (with optional SSR build).
- `composer test`: run backend lint check (`pint --test`) and PHPUnit suite.
- `php artisan test`: run backend tests only.
- `npm run lint && npm run types && npm run format:check`: frontend lint, typecheck, and formatting checks.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF, spaces, 4-space indentation (YAML: 2 spaces).
- PHP: format with Laravel Pint (`composer run lint`).
- TS/React: ESLint + Prettier (`eslint.config.js`, `.prettierrc`), single quotes, semicolons, 80-char print width.
- Naming: React components in `PascalCase.tsx`; hooks as `useX.ts(x)`; utility modules and route/page files use descriptive names aligned with feature context.

## Testing Guidelines
- Backend uses PHPUnit (`phpunit.xml`) with in-memory SQLite defaults for tests.
- Place integration behavior in `tests/Feature/*Test.php`; isolated logic in `tests/Unit/*Test.php`.
- Frontend tests use Vitest + Testing Library under `resources/js/landing/tests`.
- Run relevant focused tests before PR, then run full `composer test` for backend changes.

## Commit & Pull Request Guidelines
- Prefer Conventional Commit style seen in history: `feat: ...`, `fix: ...`, `chore: ...`.
- Keep subject lines imperative and specific (what changed and why).
- PRs should include: concise summary, linked issue/ticket, test evidence (commands run), and screenshots/GIFs for UI changes.
- Keep PR scope focused; separate refactors from feature or bugfix work when possible.
