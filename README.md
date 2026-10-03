# Low-Level Design Lab

An interactive visual learning experience for Low-Level Design.

**Don’t memorize patterns. Learn why object models bend, break, and get refactored.**

> Model it. Stress it. Understand why it became painful. Then refactor it.

## Live website

[chetanamritanshu.github.io/Low-Level-Design-Lab](https://chetanamritanshu.github.io/Low-Level-Design-Lab/)

The current release includes:

- an interactive LLD-specific homepage and Object Lab
- the complete 50-topic learning map
- full production lessons for Chapters 01–11, from OOP Fundamentals through Interfaces & API Design
- deterministic object-builder, classification, invariant, mutation, abstraction, dispatch, and hierarchy labs
- a persistent C++, Go, Java, and TypeScript code-language preference
- 10 preview systems in the Interview Arena
- responsive, keyboard-accessible, and reduced-motion experiences

## Philosophy and sibling relationship

Low-Level Design Lab is the independent sibling of [System Design Lab](https://github.com/ChetanAmritanshu/System-Design-Lab). The HLD project asks what breaks when a system scales. This project asks what breaks when code changes.

The repositories intentionally share engineering conventions—Next.js App Router, typed curriculum data, static export, visual tokens, lesson primitives, small client-side labs, and GitHub Pages deployment—without importing from or coupling to one another. A future unified learning platform can align both curricula through compatible topic metadata and component concepts.

## Curriculum

The 50 chapters progress through:

1. Object Thinking & OOP — chapters 01–04
2. SOLID & Maintainability — chapters 05–16
3. Patterns & Extensibility — chapters 17–29
4. Concurrency & Runtime — chapters 30–37
5. Machine Coding — chapters 38–50

Chapters 01–11 are implemented. Chapters 12–50 are represented with complete metadata and marked **Coming soon**.

## Multi-language code philosophy

Examples support C++, Go, Java, and TypeScript where the comparison improves understanding. They are written idiomatically rather than mechanically translated:

- C++ emphasizes ownership, value/reference semantics, RAII, and virtual dispatch.
- Go uses structs, composition, methods, and implicit interface satisfaction without class inheritance.
- Java uses interfaces, records, classes, and constructor injection.
- TypeScript uses structural typing, interfaces, composition, and runtime validation where required.

The selected language is saved in `localStorage` under `lld-lab:preferred-language` and reused across lessons.

## Local development

Requirements: Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Run the full validation suite before contributing:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run build:pages
```

## Project structure

```text
src/
  app/                 App Router pages and global visual system
    learn/             Static lesson routes
  components/
    code/              Persistent multi-language code viewer
    diagrams/          Object and dependency visuals
    labs/              Deterministic interactive teaching labs
    lesson/            Reusable lesson presentation patterns
    ui/                Shared interface primitives
  content/             Typed, language-aware lesson examples
  data/                Curriculum and interview-system metadata
```

Educational content lives as typed web content. The website does not parse or depend on a spreadsheet at runtime. The source masterplan can guide editorial decisions without becoming a production dependency.

## Adding a lesson

1. Confirm its prerequisite and pressure in `src/data/topics.ts`.
2. Define the real scenario, naive model, requirement change, observed pain, derived concept, and trade-offs.
3. Add typed content under `src/content/` and a static App Router page under `src/app/learn/`.
4. Reuse lesson primitives only when the presentation pattern is genuinely shared.
5. Add a client component only for an actual interaction.
6. Mark the topic available and verify every internal link.
7. Test keyboard navigation, reduced motion, narrow viewports, and static Pages export.

Every substantial lesson should make the learner observe, predict, interact, break, refactor, answer, implement, and defend—not merely scroll through definitions.

## GitHub Pages deployment

The application uses Next.js static export with unoptimized images and trailing slashes. When `GITHUB_PAGES=true`, `next.config.ts` applies the `/Low-Level-Design-Lab` base path and asset prefix. The export is written to `out/`, and `public/.nojekyll` is copied into it.

Pushes to `main` run `.github/workflows/deploy-pages.yml`, which:

1. installs locked dependencies with `npm ci`
2. runs lint and TypeScript checks
3. verifies the normal static build
4. builds the base-path-aware Pages export
5. uploads `out/` and deploys with the official GitHub Pages actions

No backend, authentication, database, or runtime API is required.

## Future HLD + LLD merge strategy

Both labs keep compatible chapter numbers, typed topic groups, route metadata, site primitives, design tokens, and deployment behavior. A future platform can introduce a shared package or migrate both curricula into one application after the common contracts are proven. Until then, each repository remains independently buildable, deployable, and understandable.
