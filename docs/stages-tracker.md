# Monstrino UI — Stages Tracker

> Статус: `[ ]` не начато · `[~]` в процессе · `[x]` завершено
> Reality patch: `2026-04-08`
> Verification state (2026-04-08): `lint` 0 errors · `tsc` PASS · `build` PASS · `test` 83/83 PASS · `test:e2e` blocked (playwright install needed, GAP-007).

---

## Phase 1 — Domain Model & Type Foundation

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 1.1 | Создать `src/entities/release/` — `types.ts`, `schema.ts`, `mapper.ts`, `index.ts` | [x] | |
| 1.2 | Создать `src/entities/series/` — три слоя типов + Zod + mapper | [x] | |
| 1.3 | Создать `src/entities/character/` — три слоя типов + Zod + mapper | [x] | |
| 1.4 | Создать `src/entities/pet/` — три слоя типов + Zod + mapper | [x] | |
| 1.5 | Создать `src/entities/shared/` — `BrandedId`, `EntityAudit`, value types | [x] | |
| 1.6 | Аудит импортов `release-hub/entities/*`, заменить на `src/entities/*` | [x] | Остаточные импорты убраны из `src`; для `CharacterIndexData` добавлен `src/entities/character-index` |
| 1.7 | Пометить `release-hub/entities/` как `@deprecated` | [x] | |

---

## Phase 2 — API Layer

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 2.1 | Создать `src/shared/api/http/httpClient.ts` — обёртка fetch с envelope unwrap | [x] | |
| 2.2 | Создать `src/shared/api/http/errors.ts` — `ApiError`, `NetworkError`, `ValidationError` | [x] | |
| 2.3 | Создать `src/shared/api/resources/releases.ts` — `getReleaseById`, `getReleasesList` | [x] | |
| 2.4 | Создать ресурсы для `series.ts`, `characters.ts`, `pets.ts` | [x] | |
| 2.5 | Добавить `NEXT_PUBLIC_USE_MOCK_DATA` env var, создать `mockClient.ts` | [x] | |
| 2.6 | Убрать тихий `null`-fallback из серверного API — только data или error | [x] | `releaseHub.server.ts` помечен @deprecated, `revalidate/route.ts` → `revalidateTag` |
| 2.7 | Создать `src/__mocks__/entities.ts` — ApiDto-shaped mock data adapter | [x] | Физическое перемещение real-data файлов → Phase 7 (зависимостей слишком много) |
| 2.8 | Создать `src/shared/api/queryKeys.ts` — все ключи React Query в одном месте | [x] | |
| 2.9 | Создать `useRelease(id)`, `useReleasesList()` хуки | [x] | |
| 2.10 | Создать `useSeries(id)`, `useCharacter(id)`, `usePet(id)` хуки | [x] | Хуки интегрированы в production detail views через `initialData` от SSR |

---

## Phase 3 — SEO & Indexability

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 3.1 | Обновить `generateMetadata()` на всех страницах — `openGraph`, `twitter`, `canonical`, `robots` | [x] | detail metadata централизована через `shared/seo/detailMetadata.ts`; Next не поддерживает `og:type=product`, product-сигнал отдаётся через JSON-LD |
| 3.2 | Добавить `keywords` и `lastModified` в metadata | [x] | keywords + lastModified из updated_at |
| 3.3 | Создать `src/shared/seo/structuredData/releaseSchema.ts` — schema.org/Product | [x] | + petSchema.ts |
| 3.4 | Создать `seriesSchema.ts`, `characterSchema.ts`, `breadcrumbSchema.ts` | [x] | |
| 3.5 | Подключить все JSON-LD схемы в detail-страницы | [x] | JsonLd + BreadcrumbJsonLd в StructuredData.tsx |
| 3.6 | Добавить `BreadcrumbList` на все каталог и detail страницы | [x] | BreadcrumbJsonLd на всех 4 detail страницах |
| 3.7 | `sitemap.ts` — генерация из backend API (releases, series, characters, pets) | [x] | мигрирован на новые ресурсы; `changeFrequency/priority` выровнены с roadmap policy |
| 3.8 | `robots.ts` — явная ссылка на sitemap, блок `/api/` | [x] | уже было реализовано |
| 3.9 | Добавить cache `tags` к каждому fetch-вызову (`release-${id}`, `release-list`, ...) | [x] | detail pages теперь используют getReleaseById и др. с тегами |
| 3.10 | Обновить `/api/revalidate` — использовать `revalidateTag()` вместо `revalidatePath()` | [x] | реализовано в Phase 2 |

---

## Phase 4 — Feature Layer

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 4.1 | Определить тип `ReleasesFilter` | [x] | `src/features/search/types.ts` |
| 4.2 | Создать `useReleasesFilter()` хук — чтение/запись URL search params | [x] | URL-persisted через `useSearchParams` |
| 4.3 | Создать `FilterPanel.tsx`, `SearchInput.tsx`, `MultiSelect.tsx` | [x] | `src/features/search/` |
| 4.4 | Интегрировать фильтры в `CatalogLayout` | [x] | Releases используют `useReleasesFilter`; каталоги `c/s/p` переведены на API hooks, legacy mock-поток убран |
| 4.5 | Определить `SortOption` тип, добавить `sort` в `ReleasesFilter` | [x] | `ReleaseSortKey`, `RELEASE_SORT_OPTIONS` |
| 4.6 | Создать `SortSelect.tsx`, persist в URL params | [x] | `src/features/sorting/SortSelect.tsx` |
| 4.7 | Создать `useFavorites()` хук — localStorage для анонимных | [x] | SSR-safe, `monstrino:favorites` |
| 4.8 | Добавить кнопку favorites в `ReleaseCard` | [x] | `FavoriteButton` overlay в `ReleaseCardCatalog` |
| 4.9 | Создать страницу `src/app/favorites/page.tsx` | [x] | + `favorites/layout.tsx` |

---

## Phase 5 — Performance & Observability

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 5.1 | Lighthouse аудит — зафиксировать baseline метрики | [~] | Требует запущенного браузера — мануальный шаг; остальные оптимизации выполнены |
| 5.2 | Заменить `<img>` / `CardMedia` на `next/image` во всех card-компонентах | [x] | 9 карточек: ReleaseCardCatalog/Minimal/Character/Spotlight, PetCardCatalog/Card/CardSimple, PetOwnerCard, CharacterCard |
| 5.3 | Настроить `images.remotePatterns` в `next.config.ts` | [x] | localhost:8000 (dev) + *.monstrino.com (prod) |
| 5.4 | Добавить `priority`, `sizes`, `blurDataURL` к ключевым изображениям | [x] | `priority` prop на всех картах; detail views: `priority=true` + `blurDataURL`; `sizes` выровнены с breakpoints |
| 5.5 | Добавить skeleton-компоненты для async-контента (CLS fix) | [x] | `CatalogCardSkeleton`, `CharacterCardSkeleton`, `SeriesCardSkeleton` в `src/shared/ui/skeletons/`; подключены во все 4 каталога; `CatalogFiltersDrawer` — dynamic import (INP) |
| 5.6 | Создать `src/shared/observability/logger.ts` | [x] | prod фильтрует debug/info |
| 5.7 | Создать `src/shared/observability/errorReporter.ts`, обернуть `ErrorBoundary` | [x] | discriminated dispatch; `requestId` в логах; QueryProvider глобальный onError |

---

## Phase 6 — Testing

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 6.1 | Установить и настроить Vitest + `@testing-library/react` | [x] | `vitest.config.ts`; jsdom; path aliases; `src/__tests__/setup.ts` |
| 6.2 | Unit тесты для всех mapper-функций (`release`, `series`, `character`, `pet`) | [x] | 83 тестов; happy path, null/undefined edge cases, invalid enum fallbacks |
| 6.3 | Настроить MSW (Mock Service Worker) | [x] | `src/__tests__/msw/handlers.ts` + `server.ts`; Node server; все 4 ресурса |
| 6.4 | Integration тесты для API resource-функций | [x] | 200, 404, 500, malformed JSON, non-array response |
| 6.5 | Unit тесты для custom React Query хуков | [x] | `hooks.test.tsx`; detail + list hooks; disabled-when-id-undefined; error state |
| 6.6 | E2E smoke тесты через Playwright — home, catalog, detail | [x] | `e2e/smoke.spec.ts`; home, `/catalog/r/s/c/p`, favorites; `playwright.config.ts` |

---

## Phase 7 — Architecture Cleanup

| # | Этап | Статус | Заметки |
|---|------|--------|---------|
| 7.1 | Переместить `Header.tsx`, `Footer.tsx` → `src/widgets/layout/` | [x] | + HubLayout, InfoHeader, InfoLayout; обновлены app/(hub), info, legal layouts |
| 7.2 | Переместить `CatalogLayout.tsx` → `src/widgets/catalog/` | [x] | Уже был в widgets/catalog; app/catalog + app/favorites теперь: HubLayout + CatalogLayout |
| 7.3 | Переместить info/legal страницы в `src/app/` | [x] | Info компоненты → `src/widgets/info/`; все `app/info/*` и `app/legal/*` обновлены |
| 7.4 | Мигрировать index-компоненты (`ReleaseIndex`, `SeriesIndex`, ...) в `widgets/catalog/` | [x] | Все 4 Index + каталоги + Legacy каталоги; legacy-типы → `src/shared/legacy-types/` |
| 7.5 | Удалить `src/release-hub/` директорию | [x] | Удалено; Homepage → widgets/home/; designTokens → shared/ui/designTokens |
| 7.6 | Установить `eslint-plugin-boundaries`, настроить FSD-правила | [x] | `eslint.config.mjs`; 5 слоёв (app/widgets/features/entities/shared); warn-режим |
| 7.7 | Создать `src/shared/config/env.ts` — централизованный, Zod-валидированный конфиг | [x] | Zod-схема; в prod бросает ошибку; именованные экспорты: backendUrl, useMockData, isProd, … |
| 7.8 | Заменить все прямые `process.env.*` на `config.*` | [x] | httpClient, mockClient, logger, QueryProvider, ErrorBoundary, i18n, revalidate, catalog pages |

---

## Прогресс по фазам

| Фаза | Всего | Готово | % |
|------|-------|--------|---|
| Phase 1 — Domain Models | 7 | 7 | 100% |
| Phase 2 — API Layer | 10 | 10 | 100% |
| Phase 3 — SEO | 10 | 10 | 100% |
| Phase 4 — Features | 9 | 9 | 100% |
| Phase 5 — Performance | 7 | 6 | 86% |
| Phase 6 — Testing | 6 | 6 | 100% |
| Phase 7 — Cleanup | 8 | 8 | 100% |
| **Итого** | **57** | **56** | **98%** |
