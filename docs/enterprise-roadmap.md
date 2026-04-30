# Monstrino UI — Enterprise Improvement Roadmap

> **Context:** Next.js 16 App Router, MUI v7 + Tailwind CSS, React Query, TypeScript strict, ISR.
> Current state: functional MVP with mock data fallback, partial layered architecture (FSD-inspired), SEO foundation in place.
> Goal: production-grade frontend connected to backend API, with full SEO, typed data models, and enterprise patterns.

---

## Phase 1 — Domain Model & Type Foundation

**Goal:** Establish a single source of truth for all frontend types, eliminating the current split between `release-hub/entities/` and `shared/seo/releaseHub.ts`.

### 1.1 Consolidate and Harden API Contract Types

Current state: `ReleaseApi` in `shared/seo/releaseHub.ts` is partial and ad-hoc (all fields optional). Domain types in `release-hub/entities/` are rich but disconnected from the API.

**Steps:**
1. Create `src/entities/` modules per domain aggregate:
   - `src/entities/release/` — `types.ts`, `index.ts`
   - `src/entities/series/`
   - `src/entities/character/`
   - `src/entities/pet/`
   - `src/entities/shared/` — branded IDs, audit fields, value types
2. For each entity define **three type layers**:
   - `*ApiDto` — raw backend response shape (matches backend Pydantic schemas exactly)
   - `*Model` — rich frontend domain model with branded IDs and parsed dates
   - `*Summary` — lightweight shape used in list/card contexts
3. Migrate branded ID types (`BrandedId<T>`) from `release-hub` to `entities/shared`
4. Add `mappers/` per entity: `fromApiDto(dto: *ApiDto): *Model`
5. Validate API responses with **Zod** schemas (already installed) — throw on contract violation

**Files to create/migrate:**
- `src/entities/release/types.ts` — full type hierarchy
- `src/entities/release/schema.ts` — Zod validation schema
- `src/entities/release/mapper.ts` — DTO → Model mapping
- `src/entities/release/index.ts` — public API of the module
- Repeat for `series`, `character`, `pet`

**Outcome:** All API responses are validated and typed at the boundary. Downstream code works with `*Model` types, never raw API shapes.

---

### 1.2 Migrate Away from `release-hub/entities/`

1. Audit all imports of `release-hub/entities/*` across the codebase
2. Replace with imports from the new `src/entities/*` modules
3. Mark `release-hub/entities/` as deprecated (add `@deprecated` JSDoc)
4. Remove after all consumers are migrated

---

## Phase 2 — API Layer

**Goal:** Replace ad-hoc fetch calls with a structured, typed API client layer.

### 2.1 Create a Centralized HTTP Client

Current state: raw `fetch()` in two separate files (`releaseHub.server.ts`, `releaseHub.client.ts`) with duplicated logic.

**Steps:**
1. Create `src/shared/api/http/` module:
   - `httpClient.ts` — base client wrapping `fetch`:
     - Handles the Monstrino envelope `{ success, data, error, meta }`
     - Unwraps `data` automatically
     - Throws typed `ApiError` with `{ code, message, requestId }`
     - Accepts `RequestInit` extensions: `revalidate`, `tags` (for ISR)
   - `errors.ts` — `ApiError`, `NetworkError`, `ValidationError` classes
2. Create `src/shared/api/resources/` — one file per domain resource:
   - `releases.ts` — `getReleaseById()`, `getReleasesList()`, `searchReleases()`
   - `series.ts`, `characters.ts`, `pets.ts`
3. Each resource function returns **typed** `*ApiDto` (validated with Zod)
4. Separate server vs client variants via a config flag, not separate files:
   ```ts
   createApiClient({ context: 'server' | 'client' })
   ```

**Outcome:** One API layer with full type safety, Zod validation, and proper error types.

---

### 2.2 Replace Mock Data Fallback with Feature Flags

Current state: mock data in `src/data/real-data/` used as silent fallback when API is unavailable.

**Steps:**
1. Add env var `NEXT_PUBLIC_USE_MOCK_DATA=true|false`
2. Create `src/shared/api/mockClient.ts` — returns mock data for each resource function, same interface as real client
3. In each resource function, switch client based on env var
4. Remove silent `null`-fallback pattern from server API — either data or error, never silent null
5. Keep mock data files but move to `src/__mocks__/` — used only in tests and explicit mock mode

**Outcome:** Mock mode is intentional and explicit, not an invisible fallback. Production never silently serves stale mock data.

---

### 2.3 React Query Custom Hooks Layer

Current state: React Query config exists but is used directly in components without custom hooks.

**Steps:**
1. Create `src/features/*/hooks/` — one hook per query:
   - `useRelease(id: string)` — wraps `useQuery(['release', id], ...)`
   - `useReleasesList(filters: ReleasesFilter)` — with pagination
   - `useSeries(id)`, `useCharacter(id)`, `usePet(id)`
2. Each hook encodes:
   - Query key factory (centralized in `queryKeys.ts`)
   - Stale time policy per resource type
   - `enabled` condition
   - `select` transformer: maps `*ApiDto` → `*Model`
3. Create `src/shared/api/queryKeys.ts` — all query keys in one place to prevent cache collisions

**Outcome:** No component reaches into the API client directly. All data access is through typed hooks.

---

## Phase 3 — SEO & Indexability

**Goal:** Full search engine indexability across all catalog pages with structured data and correct metadata.

### 3.1 Complete Metadata Coverage

Current state: `generateMetadata()` exists on detail pages but relies on partial `ReleaseApi` type.

**Steps:**
1. Upgrade `generateMetadata()` on all catalog pages to use full `*Model` after Phase 1+2:
   - `title` — display name
   - `description` — from API or generated from character + year + series
   - `openGraph` — type `"product"`, image from `media` field, locale
   - `twitter` — card type, image, title
   - `canonical` — always explicit via `alternates.canonical`
   - `robots` — `index, follow` for published content; `noindex` for draft/empty pages
2. Add `keywords` metadata field (array of character names, series, year, type)
3. Add `lastModified` from `updated_at` API field

---

### 3.2 Structured Data (JSON-LD)

Current state: `ProductStructuredData` component exists but is not populated with real backend data.

**Steps:**
1. Create `src/shared/seo/structuredData/` module:
   - `releaseSchema.ts` — `schema.org/Product` shape from `ReleaseModel`
   - `seriesSchema.ts` — `schema.org/Collection`
   - `characterSchema.ts` — `schema.org/Person`
   - `breadcrumbSchema.ts` — `schema.org/BreadcrumbList`
2. Each schema function takes a `*Model` and returns a JSON-LD object
3. Render all schemas in the detail page `<head>` via `StructuredData` component
4. Add `BreadcrumbList` to all catalog and detail pages

---

### 3.3 Dynamic Sitemap and Robots

Current state: `sitemap.ts` and `robots.ts` exist but use static data.

**Steps:**
1. In `sitemap.ts` — call API server-side to enumerate all published releases, series, characters, pets
2. Set `changeFrequency` per type:
   - `release` → `"monthly"` (catalog rarely changes)
   - `series` → `"monthly"`
   - `character` → `"yearly"`
3. Set `priority` by entity importance (release: 0.8, series: 0.7, character: 0.6)
4. Split into `sitemap/[sitemapIndex].ts` if entity count exceeds 50k URLs
5. In `robots.ts` — reference sitemap URL explicitly, block `/api/` routes

---

### 3.4 ISR Tagging Strategy

Current state: ISR configured with fixed TTL (12h, 1h). On-demand revalidation endpoint exists but uses generic entity types.

**Steps:**
1. Add cache `tags` to every `fetch()` call:
   - `release-${id}` for detail pages
   - `release-list` for listing pages
   - `series-${id}`, `character-${id}`, `pet-${id}` equivalently
2. Update `/api/revalidate` endpoint to call `revalidateTag()` instead of `revalidatePath()`
3. Backend webhook: when a release is updated, call the revalidate endpoint with tag `release-${id}`
4. Keep TTL as fallback, not primary strategy

---

## Phase 4 — Feature Layer

**Goal:** Implement functional features that are currently empty placeholders.

### 4.1 Catalog Filtering & Search

Files exist as `.gitkeep` in `src/features/filters/`, `src/features/search/`.

**Steps:**
1. Define `ReleasesFilter` type:
   ```ts
   type ReleasesFilter = {
     search?: string
     series?: SeriesId[]
     character?: CharacterId[]
     type?: ReleaseType[]
     rarity?: ReleaseRarity[]
     year?: number[]
     inStock?: boolean
   }
   ```
2. Persist filters in URL search params (`useSearchParams` + `useRouter`)
3. Server-side filtering: pass filter params to API, not filter client-side
4. Create `useReleasesFilter()` hook — reads/writes URL params, returns typed `ReleasesFilter`
5. Create filter components in `src/features/filters/`:
   - `FilterPanel.tsx` — container
   - `SearchInput.tsx` — debounced text search
   - `MultiSelect.tsx` — reusable for series, character, type, rarity
6. Integrate filters into `CatalogLayout` widget

---

### 4.2 Favorites / Wishlist

Files exist as `.gitkeep` in `src/features/favorites/`.

**Steps:**
1. Storage: `localStorage` for anonymous users, backend API for authenticated
2. Create `useFavorites()` hook:
   - `addFavorite(releaseId)`, `removeFavorite(releaseId)`, `isFavorite(releaseId)`
3. Add favorite toggle button to `ReleaseCard` components
4. Create favorites page at `src/app/favorites/page.tsx`
5. Future: sync with user session via `POST /api/v1/users/favorites`

---

### 4.3 Sorting

**Steps:**
1. Define `SortOption` type: `{ field: 'name' | 'year' | 'rarity' | 'price', direction: 'asc' | 'desc' }`
2. Add `sort` param to `ReleasesFilter`
3. Pass to API — let backend handle sorting, not client
4. Create `SortSelect.tsx` component
5. Persist in URL params alongside filters

---

## Phase 5 — Performance & Observability

### 5.1 Core Web Vitals

**Steps:**
1. Run Lighthouse audit on catalog and detail pages — document baseline scores
2. Address LCP (Largest Contentful Paint):
   - Add `priority` prop to above-the-fold images
   - Preload hero image via `<link rel="preload">`
3. Address CLS (Cumulative Layout Shift):
   - Add explicit `width`/`height` to all `<Image>` elements
   - Reserve space for async-loaded content with skeleton components
4. Address INP (Interaction to Next Paint):
   - Move heavy computations off main thread
   - Defer non-critical JS with `dynamic(() => import(...), { loading: ... })`

---

### 5.2 Image Optimization

Current state: MUI `CardMedia` with external image URLs — no optimization.

**Steps:**
1. Replace `<img>` / `CardMedia` with `next/image` throughout card components
2. Configure `next.config.ts` `images.remotePatterns` for all backend image domains
3. Use `sizes` attribute matching the card grid breakpoints
4. Add placeholder `blurDataURL` for progressive loading on detail pages

---

### 5.3 Observability

**Steps:**
1. Add `src/shared/observability/` module:
   - `logger.ts` — client-side logger (wraps `console` with log levels, filters in prod)
   - `errorReporter.ts` — captures unhandled errors, API errors, React error boundary catches
2. Wrap `ErrorBoundary` to report caught errors
3. Add route-level error tracking: log `ApiError` instances with `requestId` from meta
4. Future: integrate with Sentry or Grafana Faro (self-hosted, consistent with backend observability stack)

---

## Phase 6 — Testing

### 6.1 Unit Tests — Mappers and Hooks

**Steps:**
1. Add Vitest (preferred with Next.js) or Jest + `@testing-library/react`
2. Write unit tests for every mapper in `src/entities/*/mapper.ts`:
   - Happy path: valid DTO → expected Model
   - Edge cases: null/undefined optional fields
   - Invalid DTO: Zod schema throws
3. Write unit tests for custom hooks using `@testing-library/react` + MSW for API mocking

---

### 6.2 Integration Tests — API Client

**Steps:**
1. Use **MSW (Mock Service Worker)** to mock backend responses
2. Test each resource function:
   - 200 response → correct typed output
   - Non-2xx → `ApiError` thrown with correct fields
   - Malformed JSON → `ValidationError` thrown
3. Test the Zod validation path — invalid response shape must reject

---

### 6.3 E2E Tests

**Steps:**
1. Playwright is already available in the monorepo (via `playwright-pro` skill)
2. Write smoke tests:
   - Home page loads
   - Catalog page lists releases
   - Detail page displays release title and image
   - Metadata `<title>` matches release name
3. Run against the test environment (`NEXT_PUBLIC_BACKEND_URL` pointing to `monstrino-test`)

---

## Phase 7 — Architecture Cleanup

### 7.1 Retire `release-hub/` Package

Current state: `src/release-hub/` contains legacy layout, entity types, and index pages mixed together.

**Steps:**
1. After Phase 1 entity migration is complete, migrate layout components:
   - `Header.tsx`, `Footer.tsx` → `src/widgets/layout/`
   - `CatalogLayout.tsx` → `src/widgets/catalog/`
   - Info pages (`About`, `Contact`, `Legal`) → `src/app/info/` and `src/app/legal/`
2. Migrate index pages:
   - `ReleaseIndex.tsx` → `src/widgets/catalog/ReleaseIndex.tsx`
   - Repeat for series, character, pet
3. Delete `src/release-hub/` directory
4. Update all imports via path alias changes in `tsconfig.json`

---

### 7.2 Consistent Import Boundaries

**Steps:**
1. Enforce FSD (Feature-Sliced Design) import rules via ESLint plugin `eslint-plugin-boundaries`:
   - `app/` can import from `widgets/`, `features/`, `entities/`, `shared/`
   - `widgets/` can import from `features/`, `entities/`, `shared/` but NOT `app/`
   - `features/` can import from `entities/`, `shared/` but NOT `widgets/`, `app/`
   - `entities/` can import from `shared/` only
   - `shared/` has no internal imports
2. Add `.eslintrc` rules and run as part of CI

---

### 7.3 Environment Configuration

**Steps:**
1. Create `src/shared/config/env.ts` — centralized, validated env config:
   ```ts
   export const config = {
     backendUrl: z.string().url().parse(process.env.NEXT_PUBLIC_BACKEND_URL),
     siteUrl: z.string().url().parse(process.env.NEXT_PUBLIC_SITE_URL),
     useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
     revalidateSecret: process.env.REVALIDATE_SECRET, // server-only
   }
   ```
2. Fail fast at startup if required vars are missing (Zod throws at import time)
3. Never read `process.env.*` directly outside this file

---

## Implementation Order Summary

| Phase | Effort | Impact | Prerequisite |
|-------|--------|--------|-------------|
| Phase 1 — Domain Models | Medium | Very High | None |
| Phase 2 — API Layer | Medium | Very High | Phase 1 |
| Phase 3 — SEO | Low | High | Phase 2 |
| Phase 4 — Features | High | High | Phase 2 |
| Phase 5 — Performance | Low | Medium | Phase 2 |
| Phase 6 — Testing | Medium | High | Phase 1, 2 |
| Phase 7 — Cleanup | Low | Medium | All above |

**Recommended start:** Phase 1 (entities) → Phase 2.1 (HTTP client) → Phase 2.3 (custom hooks) → Phase 3 (SEO). These unblock everything else and have the highest return with minimal risk.
