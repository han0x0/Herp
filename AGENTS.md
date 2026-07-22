# Repository Guidelines

Herp is a self-hosted companion health and care tracker built with SvelteKit, SQLite (Drizzle ORM), and Tailwind CSS. This guide explains how to work on it day-to-day.

## Project Structure & Module Organization

- `src/routes/` ！ SvelteKit routes. `(app)/` is the authenticated area (members, admins, caretakers), `auth/` is login/OIDC/2FA, `setup/` is the one-time admin wizard, and `api/` exposes the bearer-token JSON API.
- `src/lib/server/` ！ Server-only code: `db/` (Drizzle schema + migrations), `auth/`, `mail/`, `notify/`, `storage/`, `video/`, `openapi/`. Anything here is never bundled to the client.
- `src/lib/components/` ！ Svelte UI, grouped by feature (`journal/`, `log/`, `reminders/`, `settings/`, `admin/`, `auth/`, `shell/`, `ui/`).
- `src/lib/i18n/` ！ Locale message catalogues (English source plus translations).
- `tests/e2e/` ！ Playwright specs. `tests/lib/` holds shared fixtures and `tests/lib/seed.ts`. `tests/fakes/` runs local stand-ins for SMTP, OIDC, S3, Immich, Paperless, and ntfy.
- `drizzle/` ！ Generated SQL migrations (committed). `data/` ！ SQLite DB and uploaded media (gitignored).
- `docs/` ！ Screenshots and docs assets. `scripts/` ！ Maintenance scripts.

## Build, Test, and Development Commands

```bash
npm install                # install deps (needs Node 20+, npm 10+)
npm run db:generate        # regenerate SQL migrations after schema edits
npm run db:migrate         # apply pending migrations to ./data/Herp.db
npm run dev                # dev server at http://localhost:5173
npm run build              # production build into build/
npm run preview            # serve the production build
npm run check              # svelte-check / TypeScript
npm run lint               # prettier --check . && eslint .
npm run format             # prettier --write .
npm run test:unit          # Vitest (fresh in-memory DB per file)
npm run test:e2e           # Playwright against real server processes
npm test                   # unit + e2e
npm run db:studio          # Drizzle Studio DB browser
```

No `.env` is required for local dev. First visit redirects to `/setup` to create the admin account.

## Coding Style & Naming Conventions

- TypeScript strict mode; no implicit `any`.
- Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) ！ no legacy Svelte 4 syntax.
- Prettier config: tabs, single quotes, no trailing commas, `printWidth: 100`. Run `npm run format` before committing.
- ESLint flat config with `eslint-plugin-svelte`, `@typescript-eslint`, and `prettier` integration.
- File naming: routes are kebab-case directories; Svelte components PascalCase (`JournalEntryCard.svelte`); server helpers camelCase (`sendReminder.ts`).
- Database tables and columns are snake_case in SQL (`companion_id`), camelCase in TS (`companionId`). Schema changes go through Drizzle migrations.

## Testing Guidelines

- Unit tests live next to the code they cover (`src/**/*.test.ts`) and run with Vitest. Each file gets a fresh in-memory SQLite.
- E2e specs in `tests/e2e/` build the app for production and drive Chromium against real server processes. Use `PW_SKIP_BUILD=1 npm run test:e2e` to iterate against the existing build; rebuild after server-side changes.
- Install the browser once: `npx playwright install chromium` (add `sudo npx playwright install-deps chromium` on Debian/Ubuntu).
- Name tests after behavior: `it('rejects expired session', ...)` rather than method names. Cover bug fixes with a regression test that would have caught the original failure.

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits: `feat(scope): summary`, `fix(scope):`, `chore:`, `refactor:`, etc. Keep the subject under ~72 chars.
- One logical change per commit; PRs stay focused on a single concern.
- Before opening a PR: `npm run check`, `npm run lint`, and `npm test` must all pass (CI runs the full suite sharded across four runners).
- PR description: what changed and why, linked issue, reproduction or screenshots for UI changes, and notes on schema/config impacts.
- Schema changes: run `db:generate` and `db:migrate`, commit the schema and the generated migration together, and update `tests/lib/seed.ts` if the test harness seeds those tables. Never hand-edit or squash migrations.

## Security & Configuration Tips

- The first registered account becomes the admin. There is no public signup.
- `ORIGIN` must match the URL users actually visit (CSRF protection). For local dev the default is fine; for any HTTPS deployment set it explicitly.
- OIDC, SMTP, Immich, Paperless, ntfy, and S3 are all optional and self-disable when their variables are unset. See `.env.example` for the full list.
- Report security issues via `SECURITY.md`, not public issues.
