# codykoinabox.github.io

Portfólio pessoal estático. Sem backend.

**Stack:** Next.js 16 (`output: "export"`), React 19, Tailwind 4, shadcn `base-nova`. Hosting: Firebase (`out/`).

**Onde mora o quê**
- perfil/links: `lib/site.ts`
- copy i18n: `lib/i18n/messages.ts` (`en` / `pt`, rotas `/[locale]`)
- tema: `lib/theme.ts` (light/dark + system)
- UI: `components/`, shadcn em `components/ui/`
- catálogo: `lib/projects/` (lista em `catalog/github.ts`, extras em `catalog/manual.ts`)
- páginas de projeto: `app/[locale]/projects/[slug]/`, módulos em `components/project/modules/`
- detalhes (README / tree / linguist / site): `lib/projects/catalog/details/*.json` via `npm run ingest:projects`

**Regras**
- 100% estático. Sem API routes, sem server state.
- Não rodar o app. Só editar código.
- Não inventar design system. shadcn + tokens do `globals.css`.
- Pouca copy. Não inchar página.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
