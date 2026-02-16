# create-something

A CLI to scaffold Turborepo monorepos with Next.js (shadcn) and Prisma.

## Usage

```bash
pnpm create something@latest
```

or

```bash
npm create something@latest
```

You'll be prompted for:

- **Project name** — the directory name and package scope
- **Next.js app** — includes a Next.js app with shadcn/ui, ESLint, and Docker support
- **Prisma database** — includes a Prisma package with PostgreSQL, Docker Compose, and migrations

## What gets scaffolded

```
my-app/
  apps/
    web/              # Next.js app with shadcn/ui
  packages/
    db/               # Prisma client and schema
    eslint-config/    # Shared ESLint configuration
    typescript-config/ # Shared TypeScript configuration
  .env
  docker-compose.yml  # PostgreSQL container
  Dockerfile          # Multi-stage build for Next.js
  turbo.json
```

Components are removed cleanly if you opt out — skipping the database removes the `packages/db` directory, Docker Compose, and all related scripts.

## Development

```bash
git clone https://github.com/itaibo/create-something.git
cd create-something
pnpm install
pnpm build
```

### Building templates

Templates are pre-built archives stored in GitHub Releases. The CLI downloads these at runtime instead of scaffolding from scratch. This makes creating something super fast.

To rebuild:

```bash
pnpm build-template pnpm   # or npm
```

This runs all scaffolding steps (Turborepo, shadcn, Prisma, Prettier), strips build artifacts, replaces the project name with a `{{projectName}}` placeholder, and outputs to `output/`.

CI automatically builds and uploads templates for both pnpm and npm on push to `main`.

### Project structure

```
src/
  index.ts            # CLI entry point
  build-template.ts   # Template builder entry point
  types.ts            # Shared types and constants
  generators/         # Output generators (Dockerfile, README, removal logic)
  steps/              # Template builder steps (monorepo, nextjs, database, prettier)
  utils/              # Shared utilities (exec, fs helpers, download, template replacement)
```

## License

MIT © [Iñigo Taibo](https://github.com/itaibo)
