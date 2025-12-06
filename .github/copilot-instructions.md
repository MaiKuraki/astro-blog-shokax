# Copilot Instructions for this repo

- Repo layout: Bun monorepo (turborepo) with `packages/astro-theme-shokax` (Astro + Svelte + Vue) and `packages/shokax-toolkit-lib` (TypeScript utilities). `old_project/hexo-theme-shokaX` is legacy/unused in current builds.
- Tooling: use **bun@1.3.x**. Install once at root via `bun install`. Turborepo config (`turbo.json`) marks `dev` as non-cached and `build` outputs `dist/**`.
- Astro app workflow (`packages/astro-theme-shokax`): scripts `bun run dev|build|preview|astro` (wraps `bunx --bun astro`). Alias `@` → `./src` (see `astro.config.mjs`). Integrations: Vue + Svelte + UnoCSS (reset injected).
- Content collections: `src/content.config.ts` loads Markdown from `src/posts/**/*.md` via `glob` loader. Schema requires `title`, `date` **as Date objects** (parse before passing), optional `description/tags/categories/draft/cover`. Hidden gotcha: invalid dates are rejected by zod refine.
- Theme config: `src/theme.config.ts` uses `defineConfig` and exports `siteName` + `nav: NavItemType[]`. `uno.config.ts` builds an icon `safelist` from every `nav`/`dropboxItems` icon—add icon strings (e.g., `i-ri-home-2-fill`) here so UnoCSS doesn’t purge them.
- Navbar patterns: `NavBar.svelte` guards `window`/`document` for SSR, tracks scroll to show/hide, and toggles theme via `helpers/theme.ts` (writes `vueuse-color-scheme`, sets `data-theme` on `<html>`). Prefer passing callbacks (`clickToggleCallback`, `onSearch`) over dispatching events. Keep scroll/toggle logic in `onMount` to avoid SSR errors.
- Menu rendering: `MenuBar.svelte` computes `isDesktop` from viewport width (`onMount` + resize listener) and only renders nav links/dropdowns on desktop (`width > 820`). Uses `{#each navLinks as ... (href)}`—ensure unique `href` keys.
- Dropdown UX: `DropBox.svelte` + `DropBoxItem.svelte` implement hover with enter/leave timers (link: 300ms delay, submenu: 100ms). Pass extra props through `...$$restProps`; additional classes go in `className` prop. `NavLinkItem.svelte` handles icons + hover underline; `NavItem.svelte` wraps list items.
- Styling: UnoCSS presets `presetWind4`, `presetIcons`, `presetAttributify`; reset enabled. Icons use class names like `i-ri-...`; gradient hover styles live in dropdown items. Utility classes preferred over bespoke CSS.
- Dark/light mode: helpers in `helpers/theme.ts` expose `initTheme`, `toggleTheme`, `applyTheme` with `ThemeMode` union. Maintain `data-theme` attributes for theme-sensitive styles.
- Toolkit library (`packages/shokax-toolkit-lib`):
  - `posts/formatCategories` builds hierarchical categories, sorts children by `length` descending, respects optional `depth` limit; expects categories to include `_id`, `parent?`, `length`, `posts`.
  - `posts/structurePostsByDate` groups posts by year/month (and day when `daily: true`); expects `date: Date`—convert strings before calling.
  - `posts/generateTagCloud` scales font size/color between `minFontSize`/`maxFontSize` and `startColor`/`endColor` using TinyColor; optional `limit` slices top-N tags.
  - `tools/fmtNum`, `tools/generateRandomBrightColor` are exposed via `src/index.ts` alongside post helpers.
- Testing/linting: toolkit has `bun run test` (Vitest with coverage) and `bun run lint` (ESLint). Type check with `bun run check-types`. ESLint config (`eslint.config.js`) is Antfu-based with Astro/Svelte/Vue/UnoCSS enabled; Svelte rule disables `import/no-mutable-exports` to allow `export let` props.
- When touching SSR-related code, always guard `window`/`document`. When adding nav icons or dropdown items, update `theme.config.ts` so `uno.config.ts` safelists them automatically.
