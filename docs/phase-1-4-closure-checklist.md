# Monstrino UI — Phase 1–4 Closure Checklist

Обновлено: 2026-04-07

## Цель
Закрыть фазы 1–4 **фактически**, а не только по трекеру:
- проект собирается (`lint`, `tsc`, `build` зелёные),
- архитектурные решения из roadmap реально применены,
- нет скрытого runtime-fallback на mock в production-пути.

Reality patch (2026-04-07): критерии закрытия повторно открыты, см. `docs/migration-gap-register-2026-04-07.md`.

## Глобальные критерии Done (обязательные)
- [x] `npm run lint` проходит без ошибок. _(Verified 2026-04-08: 0 errors, 63 warnings)_
- [x] `npx tsc --noEmit` проходит без ошибок. _(Verified 2026-04-08: PASS)_
- [x] `npm run build` проходит без ошибок. _(Verified 2026-04-08: ✓ Compiled successfully)_
- [x] Для detail/catalog страниц нет silent fallback (либо data, либо контролируемая ошибка/explicit mock mode).
- [x] Источник данных для UI и SEO консистентен.

---

## Порядок выполнения (Critical Path)

### Stage 0 — Stabilize Tooling (P0)
Статус: `[x]`

1. Починить ESLint-конфиг под текущий стек Next/ESLint.
2. Зафиксировать рабочую комбинацию версий (`eslint`, `eslint-config-next`) в `package.json`.

Файлы:
- `eslint.config.mjs`
- `package.json`

Критерий выхода:
- [x] `npm run lint` запускается и завершается успешно. _(2026-04-08: 0 errors)_

---

### Stage 1 — Build/Type Blockers (P0)
Статус: `[x]`

1. Исправить импорт `GENERATIONS`:
   - `src/entities/release/mapper.ts` должен брать `GENERATIONS` из `@entities/shared`.
2. Привести `revalidateTag()` к сигнатуре текущей версии Next:
   - `src/app/api/revalidate/route.ts`.
3. Убрать несовместимость `initialData` в `DetailDataHydrator`:
   - типизировать под DTO/`unknown` и убрать конфликт с `Record<string, unknown>`.
4. Устранить несовместимость `ReleaseModel/PetModel` vs legacy-данные:
   - `src/app/favorites/page.tsx`
   - `src/release-hub/Catalog/ReleaseCatalog.tsx`
   - `src/release-hub/Catalog/PetCatalog.tsx`
   - `src/release-hub/Homepage.widgets.tsx`
5. Убрать unsafe cast в `httpClient` (или привести через `unknown` + guards):
   - `src/shared/api/http/httpClient.ts`.

Критерий выхода:
- [x] `npx tsc --noEmit` зелёный. _(2026-04-08: PASS)_
- [x] `npm run build` зелёный. _(2026-04-08: PASS)_

---

### Stage 2 — Phase 1 Closure: Domain Model Consistency (P1)
Статус: `[x]`

1. Завершить миграцию от `release-hub/entities/*` в runtime-коде.
2. Заполнить `src/entities/index.ts` (barrel) или удалить пустой файл.
3. Проверить, что новые `*Model/*Summary` используются последовательно в карточках и страницах.

Критерий выхода:
- [x] Нет импортов `release-hub/entities` в рабочих UI-роутах (кроме явного legacy-контекста, если он временно оставлен).
- [x] Типовая модель едина для catalog/detail/favorites.

---

### Stage 3 — Phase 2 Closure: API Layer Contract (P1)
Статус: `[x]`

1. Убрать silent fallback в detail-страницах:
   - `src/app/catalog/r/[internal_id]/page.tsx`
   - `src/app/catalog/c/[internal_id]/page.tsx`
   - `src/app/catalog/s/[internal_id]/page.tsx`
   - `src/app/catalog/p/[internal_id]/page.tsx`
2. Заменить остатки `releaseHub.client/server` на новый resources-layer:
   - `src/shared/data/DetailDataHydrator.tsx`
   - `src/app/(hub)/s/[id]/page.tsx` (или удалить дубль роута).
3. Синхронизировать cache tags между resources и `/api/revalidate`.
4. Добавить `NEXT_PUBLIC_USE_MOCK_DATA` в `.env.example`.
5. Добавить отсутствующий API-метод из roadmap (`searchReleases`) или обновить roadmap/stages, если решение изменилось.

Критерий выхода:
- [x] Mock mode включается только явным флагом (`isMockMode()` в resources, `NEXT_PUBLIC_USE_MOCK_DATA`).
- [x] Revalidate инвалидирует те же теги, что ставятся в fetch (`release-{id}`, `release-list`, etc.).
- [x] Нет legacy-клиента в целевых маршрутах (`releaseHub.client/server` не импортируются ни одним роутом).

---

### Stage 4 — Phase 3 Closure: SEO Consistency (P2)
Статус: `[x]`

1. Привести типы OpenGraph к контенту (release detail как `product`, где применимо).
2. Проверить покрытие BreadcrumbList не только на detail, но и на catalog-страницах (если это требование остаётся).
3. Убедиться, что metadata строится из актуальной доменной модели/DTO, а не из разрозненных fallback-источников.

Критерий выхода:
- [x] Метаданные и JSON-LD соответствуют реальному источнику данных страницы.
- [x] Нет SEO-рассинхронизации между SSR metadata и клиентским UI.

---

### Stage 5 — Phase 4 Closure: Feature Layer Integration (P1)
Статус: `[x]`

1. Перевести фильтрацию/сортировку релизов на server/API path (по roadmap), а не на клиентский in-memory массив.
2. Интегрировать единый sort-компонент:
   - использовать `SortSelect`, либо удалить его и зафиксировать единый `CatalogResultsToolbar`.
3. В `useReleasesFilter` не терять посторонние URL-параметры (сохранять существующие при patch-обновлениях).
4. Подключить созданные React Query hooks в реальные страницы/виджеты.

Критерий выхода:
- [x] Фильтры/сортировка масштабируются через API.
- [x] URL-state работает без потери соседних params.
- [x] Feature-слой действительно используется UI-компонентами.

---

## Реестр задач закрытия (обновляемый)

| ID | Stage | Задача | Priority | Owner | Status | Updated |
|---|---|---|---|---|---|---|
| CL-001 | 0 | Починить ESLint конфиг/версии | P0 |  | Resolved | 2026-04-05 |
| CL-002 | 1 | Исправить `GENERATIONS` import + type/build blockers | P0 |  | Resolved | 2026-04-05 |
| CL-003 | 2 | Убрать остаточные `release-hub/entities` зависимости | P1 |  | Resolved | 2026-04-05 |
| CL-004 | 3 | Убрать silent fallback и legacy api client | P1 |  | Resolved | 2026-04-05 |
| CL-005 | 3 | Синхронизировать ISR tags + revalidate endpoint | P1 |  | Resolved | 2026-04-05 |
| CL-006 | 3 | Добавить `NEXT_PUBLIC_USE_MOCK_DATA` в `.env.example` | P2 |  | Resolved | 2026-04-05 |
| CL-007 | 4 | Выровнять SEO metadata/schema с model-потоком | P2 |  | Resolved | 2026-04-05 |
| CL-008 | 5 | Перевести фильтры/сортировку на API | P1 |  | Resolved | 2026-04-05 |
| CL-009 | 5 | Интегрировать/консолидировать sort UI | P2 |  | Resolved | 2026-04-05 |
| CL-010 | 5 | Подключить React Query hooks в production UI | P1 |  | Resolved | 2026-04-05 |

> Рекомендуемые статусы: `Open` → `In Progress` → `Blocked`/`Resolved`.

---

## PR Backlog (Reality Patch, Short List)

| PR ID | Priority | Status | Цель | Scope (минимум) | DoD |
|---|---|---|---|---|---|
| RP-001 | P0 | Resolved | Синхронизировать data-flow detail: UI = API | `src/release-hub/Index/ReleaseIndex.tsx`, `SeriesIndex.tsx`, `CharacterIndex.tsx`, `PetIndex.tsx`, `src/shared/data/DetailDataHydrator.tsx` | Detail `r/c/s/p` не читают `real-data/*`; metadata и UI получают один источник |
| RP-002 | P0 | Resolved | Закрыть legacy-мок поток в каталогах `c/s/p` | `src/release-hub/Catalog/CharacterCatalog.tsx`, `SeriesCatalog.tsx`, `PetCatalog.tsx` + соответствующие hooks/resources | Catalog `c/s/p` больше не используют `src/data/real-data/*` |
| RP-003 | P1 | Resolved | Довести hooks-layer до roadmap outcome | интеграция `useSeries/useCharacter/usePet` в production widgets/pages | Компоненты не ходят в resources напрямую там, где уже есть custom hook |
| RP-004 | P1 | Resolved | Выровнять SEO detail policy под roadmap | `src/app/catalog/*/[internal_id]/page.tsx`, `src/shared/seo/structuredData/*` | OG типы/robots/canonical/lastModified согласованы и покрыты smoke-check |
| RP-005 | P2 | Resolved | Выровнять `sitemap.ts` policy и приоритеты | `src/app/sitemap.ts` | `changeFrequency/priority` соответствуют принятой SEO политике (roadmap или обновлённый ADR) |
| RP-006 | P1 | Resolved | Закрыть Phase 1 consistency по legacy entities | `src/data/real-data/*` и связанные типы | В активном UI пути нет импорта `@/release-hub/entities`; legacy изолирован или удалён |

Примечание:
- Эти PR должны идти последовательно: `RP-001` → `RP-002` → `RP-003`, затем SEO/policy (`RP-004/005`) и финальная зачистка (`RP-006`).
- `2026-04-05`: `RP-001` закрыт — detail маршруты мигрированы на API-backed views, legacy `release-hub/Index/*` и `DetailDataHydrator` удалены.
- `2026-04-05`: `RP-002` закрыт — каталоги `c/s/p` переведены на API hooks (`useCharactersList/useSeriesList/usePetsList`) без `real-data`.
- `2026-04-05`: `RP-003` закрыт — detail views переведены на `useRelease/useSeries/useCharacter/usePet` с `initialData` из SSR.
- `2026-04-05`: `RP-004` закрыт — metadata detail-страниц централизована в `shared/seo/detailMetadata.ts` и строится из domain model; добавлены `robots`, `canonical`, `lastModified`, `locale`.
- `2026-04-05`: `RP-005` закрыт — `sitemap.ts` выровнен по policy roadmap: release/series monthly, character yearly, приоритеты обновлены.
- `2026-04-05`: `RP-006` закрыт — удалены остаточные импорты `@/release-hub/entities` и `../entities` из `src`; `character-index` типы перенесены в `src/entities/character-index`.

---

### Stage 6 — Phase 5 Closure: Performance & Observability (P2)
Статус: `[x]`

Выполнено (2026-04-06):

**5.1 Core Web Vitals:**
- `priority` prop добавлен ко всем card-компонентам (передаётся вызывающей стороной для first-fold карточек).
- Detail views (`ReleaseDetailView`, `CharacterDetailView`, `PetDetailView`, `SeriesDetailView`) используют `priority=true` на hero image.

**5.2 Image Optimization:**
- Все `<img>` / `CardMedia` с background-image заменены на `next/image` с `fill`.
- Затронутые компоненты: `ReleaseCardCatalog`, `PetCardCatalog`, `ReleaseCardMinimal`, `ReleaseCardCharacter`, `CharacterCard`, `PetCard`, `PetCardSimple`, `PetOwnerCard`, `ReleaseCardSpotlight`.
- `sizes` атрибут выровнен с breakpoints сетки.
- `next.config.ts` — добавлены `images.remotePatterns` для `localhost:8000` и `*.monstrino.com`.
- Detail views — `placeholder="blur"` + `blurDataURL` через `BLUR_DATA_URL` константу.
- `src/shared/ui/imagePlaceholder.ts` — централизованный dark-theme blur placeholder.

**5.3 Observability:**
- `src/shared/observability/logger.ts` — log-level фильтрация (prod: warn/error only).
- `src/shared/observability/errorReporter.ts` — `reportError()` с discriminated типами (`ApiError`/`NetworkError`/`ValidationError`); логирует `requestId` из ApiError для корреляции с бэкендом.
- `ErrorBoundary` — подключён к `reportError`.
- `QueryProvider` — глобальный `QueryCache.onError` + `mutations.onError` через `reportQueryError`.
- Future integration point задокументирован (Sentry / Grafana Faro).

Критерий выхода:
- [x] Все card images идут через `next/image` — нет bare `<img>` / CSS background-image.
- [x] Detail hero images — `priority` + `blurDataURL`.
- [x] `remotePatterns` покрывает dev и prod.
- [x] `ErrorBoundary` и `QueryProvider` репортят ошибки через observability module.
- [ ] `npx tsc --noEmit` — зелёный после всех изменений.

---

## Финальная верификация (когда все CL-* = Resolved)

Команды:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

Smoke-check вручную:
- [x] `/catalog/r`, `/catalog/c`, `/catalog/s`, `/catalog/p` открываются без runtime ошибок.
- [x] Detail-страницы не уходят в скрытый mock при недоступном API.
- [x] `/api/revalidate` инвалидирует нужные сущности/list.
- [x] Favorites, sorting, filtering работают на согласованном источнике данных.

Проверено (2026-04-05):
- `standalone` smoke (`node .next/standalone/server.js`) для catalog/detail/favorites — `200` без runtime-error маркеров.
- `no-api + no-mock` (`NEXT_PUBLIC_USE_MOCK_DATA=false`, `NEXT_PUBLIC_BACKEND_URL=`) — detail-страницы падают с явным `NetworkError`, скрытого mock fallback нет.
- `/api/revalidate` проверен для `release|series|character|pet` — возвращаются ожидаемые теги `*-{id}` и `*-list`.
- invalid detail id (`/catalog/r|c|s|p/999999`) возвращает корректный HTTP `404` (фикс MONUI-010).
