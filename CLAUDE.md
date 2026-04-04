# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Magic Portfolio** — a personal portfolio site built with Next.js 16, React 19, and Once UI. It features a blog (MDX), project showcase, photo gallery, about page, and newsletter subscription (Mailchimp).

**Theme**: Custom-curated dark theme with green brand/emerald accent, sand neutral.

## Commands

```bash
npm run dev        # Start dev server (Next.js with webpack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
```

No test framework is configured.

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font setup, providers, Background effects, Header/Footer)
│   ├── page.tsx                  # Homepage (hero, projects, blog preview, newsletter)
│   ├── about/page.tsx            # About page
│   ├── blog/page.tsx             # Blog listing
│   ├── blog/posts/*.mdx          # Blog posts (MDX)
│   ├── work/page.tsx             # Projects listing
│   ├── work/[slug]/page.tsx      # Individual project page (renders MDX)
│   ├── work/projects/*.mdx       # Project content files
│   ├── gallery/page.tsx          # Photo gallery
│   ├── resources/                # Configuration and content data
│   │   ├── config.js             # Theme, routes, effects, baseURL, Mailchimp settings
│   │   ├── content.js            # All text content (person, home, about, blog, work, gallery, social)
│   │   └── index.ts              # Re-exports from config.js and content.js
│   └── utils/
│       ├── utils.ts              # MDX file reading (getPosts helper using gray-matter)
│       └── formatDate.ts         # Date formatting
├── components/                   # Site-specific components
│   ├── Header.tsx                # Site navigation
│   ├── Footer.tsx                # Site footer
│   ├── mdx.tsx                   # Custom MDX component renderer (headings, links, images, tables, code blocks)
│   ├── Mailchimp.tsx             # Newsletter subscription
│   ├── RouteGuard.tsx            # Route protection middleware
│   ├── work/Projects.tsx         # Project card listing
│   └── about/TableOfContents.tsx # About page navigation
└── once-ui/                      # Once UI design system (vendored components)
    ├── components/               # Individual UI primitives (Button, Column, Flex, Heading, etc.)
    ├── modules/                  # Feature modules (CodeBlock)
    ├── styles/                   # Global SCSS styles
    ├── tokens/                   # Design tokens (colors, spacing, typography)
    ├── hooks/                    # Custom hooks
    ├── icons.ts                  # SVG icon map (extend here for new social/icons)
    ├── interfaces.ts             # TypeScript interfaces
    └── types.ts                  # Type definitions
```

### Key Patterns

- **Content-driven pages**: Blog posts and projects are `.mdx` files. The `getPosts()` helper in `utils.ts` reads MDX frontmatter via `gray-matter` and returns `{ metadata, slug, content }`. New posts/projects are created by adding `.mdx` files to `blog/posts/` or `work/projects/`.

- **Theme and config**: All theme settings live in `src/app/resources/config.js` (theme colors, border style, effects, routes, baseURL). All text content lives in `src/app/resources/content.js`. Both are re-exported from `src/app/resources/index.ts`.

- **Once UI components**: The design system is vendored in `src/once-ui/`. Components use a custom prop system with design tokens (e.g., `padding="l"`, `background="page"`, `variant="display-strong-xl"`). Layout primitives are `<Column>` and `<Flex>`. Import from `@/once-ui/components` or `@/once-ui/modules`. For Once UI documentation, use the Context7 MCP (`query-docs` with library ID `/once-ui-system/magic-portfolio`) before the Once UI docs website or web search.

- **MDX rendering**: `CustomMDX` in `@/components/mdx` renders MDX content with custom components (smart links, heading anchors, enlargeable images, code blocks). Used by both blog and work pages.

- **Dynamic routes**: `[slug]/page.tsx` for work/projects uses `generateStaticParams()` to pre-render from MDX files at build time.

- **Effects**: The `<Background>` component supports cursor mask, gradient, dots, grid, and line effects — configured in `config.js`.
