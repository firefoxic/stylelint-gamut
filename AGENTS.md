# AGENTS.md

## Commands

- Install: `pnpm ci` (Node 26 and pnpm 12 are declared in `devEngines`; `prepare` enables `.githooks`).
- Lint: `make lint` (`oxlint`).
- Fix: `make fix` (`oxlint --fix`).
- Typecheck: `make typecheck` (`tsrs` over `tsconfig.json`, includes `src/**/*.ts` incl. tests).
- Test: `make test` (`vitest`, single run); `make test-watch` for watch.
- Build: `make build` (`tsrs -p tsconfig.build.json`, outputs `dist/`, excludes tests).
- All checks: `make verify` (lint, test, typecheck, build — in that Makefile order).
- Focused test: `pnpm exec vitest src/index.test.ts` (path filter).
- Pre-commit: `.githooks/pre-commit` runs `pnx lint-staged` (`oxlint --fix` on `*.ts`).

Note: `package.json` has no `test`/`typecheck`/`build` scripts; use the `make` targets (CONTRIBUTING.md's `pnpm …` commands are stale).

## Structure

- Single package, ESM (`"type": "module"`). Entrypoint `src/index.ts`; helpers in `src/utils.ts`.
- Tests in `src/index.test.ts` via `@morev/stylelint-testing-library` (`createTestUtils`).
- Rule name: `gamut/color-no-out-gamut-range` (plugin namespaces rules under `gamut/`).
- Published artifact is `dist/**` (gitignored); `files` ships only `dist/**`.

## Conventions

- Indentation is tabs (`.editorconfig`); markdown keeps trailing whitespace.
- Lint extends `@firefoxic/oxlint-config`; overrides `import/exports-last` off; test files override `no-undefined` off.
- Source uses backticks for string literals; keep that style.
- Only `src/` is compiled; `src/**/*.test.ts` is excluded from builds.

## Quirks

- Vitest runs with `isolate: false`, `watch: false`; reporters are `github-actions` in CI, `dot` locally.
- Typecheck/build include dependency `.d.ts` and need `@types/node` + `undici-types`, which are optional peers not installed by `pnpm ci`. If `make typecheck`/`make build` fail on missing node types, install those two packages manually.
- `tsrs` is a `tsc` replacement (supports `-p`, `--fast`).
- Gamut media-query detection (`utils.ts`) only walks the declaration's direct parent and grandparent `@media` at-rule; deeper nesting is not detected.
- Custom-property resolution and gamut checks are in `src/index.ts`; `colorjs.io` `Color` is the color implementation.

## CI

- `.github/workflows/test.yml`: `pnpm ci` then `make verify`, on push to `main` and all PRs.
- `.github/workflows/release.yaml`: same checks then `@firefoxic/release-it`, on `release*` branches.