# Monstrino UI — Реестр проблем и статусов

Обновлено: 2026-04-07

## Назначение
Этот файл хранит технические проблемы проекта, их текущий статус и историю изменений.
Reality-check snapshot: `docs/migration-gap-register-2026-04-07.md`.

## Статусы
- `Open` — обнаружено, но не начато.
- `In Progress` — ведется работа.
- `Blocked` — есть блокер.
- `Resolved` — исправлено, ждет/прошло проверку.
- `Archived` — закрыто и перенесено в архивный контекст.

## Приоритет
- `P0` — критично для стабильности/релизов.
- `P1` — высокий приоритет.
- `P2` — средний приоритет.
- `P3` — низкий приоритет.

## Индекс проблем
| ID | Проблема | Приоритет | Статус | Дата открытия | Дата обновления |
|---|---|---|---|---|---|
| MONUI-001 | `lint` не проходит (ошибки правил + resolver шум) | P0 | Resolved | 2026-04-04 | 2026-04-08 |
| MONUI-002 | Двойной источник данных (API + mock в runtime UI) | P0 | In Progress | 2026-04-04 | 2026-04-07 |
| MONUI-003 | God-components и чрезмерно крупные файлы (Release/Index/Catalog) | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-004 | Дублирование роутов и page-логики | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-005 | Фрагментация дизайн-системы и токенов | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-006 | Низкая типобезопасность (`any`, нестрогая нормализация API) | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-007 | Технический шум/legacy-артефакты в репозитории | P2 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-008 | Тестовый контур частично внедрён, но не закрыт end-to-end | P1 | In Progress | 2026-04-04 | 2026-04-07 |
| MONUI-009 | Архитектурный дрейф относительно ARCHITECTURE.md | P2 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-010 | Detail-route с невалидным id отвечает `200` вместо `404` | P1 | Resolved | 2026-04-05 | 2026-04-05 |
| MONUI-011 | Пост-миграционные type/build блокеры (Phase 7 regression) | P0 | Resolved | 2026-04-07 | 2026-04-08 |
| MONUI-012 | Рассинхрон docs-трекеров с фактическим статусом сборки | P0 | Resolved | 2026-04-07 | 2026-04-08 |
| MONUI-013 | E2E smoke не запускается в окружении (Playwright browsers missing) | P1 | Open | 2026-04-07 | 2026-04-07 |

---

## Карточки проблем

### MONUI-001 — `lint` не проходит (ошибки правил + resolver шум)
- Status: `Resolved`
- Priority: `P0`
- Area: Tooling / CI
- Opened: `2026-04-04`
- Updated: `2026-04-08`
- Description:
  - `npm run lint` падает не только из-за конфигурации, но и из-за реальных ошибок кода.
  - Дополнительно есть массовый noise от boundaries resolver и deprecated rule.
- Evidence:
  - `eslint.config.mjs`
  - `src/widgets/catalog/ReleaseIndex.tsx`
  - `src/widgets/catalog/CharacterCatalog.tsx`
  - `src/widgets/market/MarketCards.tsx`
- Exit Criteria:
  - `npm run lint` проходит локально и в CI.
  - Устранены `react-hooks/rules-of-hooks`, `react-hooks/set-state-in-effect`, `react/no-unescaped-entities` ошибки.
  - Конфиг boundaries обновлён до актуального rule naming и без resolver warnings.
- Updates:
  - `2026-04-04`: проблема зафиксирована.
  - `2026-04-07`: подтверждено `26 errors / 160 warnings`; проблема остаётся P0.
  - `2026-04-08`: исправлены все code errors (rules-of-hooks, set-state-in-effect, no-unescaped-entities, prefer-const, display-name); `element-types` → `dependencies`; установлен `eslint-import-resolver-typescript`; результат: `0 errors, 63 warnings`.

### MONUI-002 — Двойной источник данных (API + mock в runtime UI)
- Status: `In Progress`
- Priority: `P0`
- Area: Data Flow / Architecture
- Opened: `2026-04-04`
- Updated: `2026-04-07`
- Description:
  - Основные catalog/detail маршруты переведены на API.
  - Остаток проблемы локализован в legacy home widgets, которые все еще читают `src/data/real-data/*`.
  - Возможна рассинхронизация данных между метаданными и UI.
- Evidence:
  - `src/widgets/home/Homepage.widgets.tsx`
  - `src/data/real-data/releaseIndexMock.ts`
  - `.env.local`
  - `src/app/catalog/c/page.tsx`
  - `src/app/catalog/s/page.tsx`
  - `src/app/catalog/p/page.tsx`
- Exit Criteria:
  - Единый источник истины для detail/catalog страниц.
  - Для `useMockData` зафиксирована и задокументирована единая policy окружений.
  - Моки остаются только как dev fixtures/fallback по явной стратегии.
- Updates:
  - `2026-04-04`: проблема зафиксирована.
  - `2026-04-05`: detail (`r/c/s/p`) и catalog (`c/s/p`) переведены на API hooks/views; legacy index/hydrator удалены.
  - `2026-04-07`: обнаружен смешанный legacy/new рендер при `NEXT_PUBLIC_USE_MOCK_DATA=true`, визуально отличается от ожидаемого baseline.

### MONUI-003 — God-components и крупные файлы
- Status: `Open`
- Priority: `P1`
- Area: Frontend Structure
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Крупные страницы содержат и data logic, и UI composition, и локальные nested-компоненты.
- Evidence:
  - `src/release-hub/Homepage.widgets.tsx`
  - `src/release-hub/Catalog/ReleaseCatalog.tsx`
  - `src/pages-for-future/market_prices/MarketPricesV6.tsx`
- Exit Criteria:
  - Разделение на `sections/`, `hooks/`, `view-model/`.
  - Page-компонент выполняет orchestration, а не всю бизнес-логику.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-004 — Дублирование роутов и page-логики
- Status: `Open`
- Priority: `P1`
- Area: Routing
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Похожие route handlers продублированы в нескольких местах.
- Evidence:
  - `src/app/(hub)/s/[id]/page.tsx`
  - `src/app/catalog/s/[internal_id]/page.tsx`
  - `src/app/(hub)/p/[id]/page.tsx`
  - `src/app/catalog/p/[internal_id]/page.tsx`
- Exit Criteria:
  - Переиспользуемый shared loader/factory или redirect-стратегия без копипаста.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-005 — Фрагментация дизайн-системы и токенов
- Status: `Open`
- Priority: `P1`
- Area: UI Foundation
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Токены и стили определяются в нескольких независимых местах (`theme`, `release-hub`, `globals.css`, inline).
- Evidence:
  - `src/shared/theme/tokens.ts`
  - `src/release-hub/designTokens.ts`
  - `src/app/globals.css`
  - `src/release-hub/Index/ReleaseIndex.tsx`
- Exit Criteria:
  - Один источник токенов.
  - Удалены дубли токенов/утилитарных классов.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-006 — Низкая типобезопасность (`any`)
- Status: `Open`
- Priority: `P1`
- Area: Type Safety
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Используются `as any` и неявная обработка API-полей.
- Evidence:
  - `src/shared/seo/releaseHub.ts`
  - `src/app/catalog/r/[internal_id]/page.tsx`
  - `src/app/catalog/c/[internal_id]/page.tsx`
- Exit Criteria:
  - Для API-входа используются явные DTO + runtime validation (например, zod).
  - Критичные места очищены от `any`.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-007 — Технический шум/legacy-артефакты
- Status: `Open`
- Priority: `P2`
- Area: Repo Hygiene
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - В рабочем дереве остаются копии/устаревшие файлы и legacy-папки.
- Evidence:
  - `README copy.md`
  - `.gitignore copy`
  - `src/shared/theme/muiTheme(outdated).ts`
  - `ui-old/`
- Exit Criteria:
  - Удалены/перемещены артефакты, README актуализирован.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-008 — Тестовый контур частично внедрён, но не закрыт end-to-end
- Status: `In Progress`
- Priority: `P1`
- Area: Quality / Reliability
- Opened: `2026-04-04`
- Updated: `2026-04-07`
- Description:
  - Unit/integration тесты добавлены и проходят.
  - E2E контур не operational в текущем окружении (отсутствуют Playwright browser binaries).
- Evidence:
  - `src/entities/*/mapper.test.ts`
  - `src/shared/api/resources/*.test.ts`
  - `e2e/smoke.spec.ts`
  - `playwright.config.ts`
- Exit Criteria:
  - Базовый тестовый стек подключен и запускается в CI.
  - `npm run test:e2e` исполним в CI и локально, smoke сценарии зелёные.
- Updates:
  - `2026-04-04`: проблема зафиксирована.
  - `2026-04-07`: `vitest` зелёный (`83/83`), `test:e2e` падает до исполнения тестов из-за отсутствия browser binaries.

### MONUI-009 — Архитектурный дрейф относительно ARCHITECTURE.md
- Status: `Open`
- Priority: `P2`
- Area: Architecture Governance
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Фактическая структура и распределение ответственности расходятся с документированной целевой архитектурой.
- Evidence:
  - `ARCHITECTURE.md`
  - `docs/stages-tracker.md`
  - `docs/phase-1-4-closure-checklist.md`
- Exit Criteria:
  - Зафиксирован plan migration + правила контроля зависимостей слоев.
  - Статусы roadmap/tracker отражают фактический результат verification-команд.
- Updates:
  - `2026-04-04`: проблема зафиксирована.
  - `2026-04-07`: обнаружено расхождение between tracker claims и фактическим состоянием (`lint/tsc/build` red).

### MONUI-011 — Пост-миграционные type/build блокеры (Phase 7 regression)
- Status: `Resolved`
- Priority: `P0`
- Area: Build / Type Safety
- Opened: `2026-04-07`
- Updated: `2026-04-08`
- Description:
  - После удаления `src/release-hub` остались несовместимые импорты/экспорты и битые module-path.
  - В текущем состоянии это блокирует `tsc` и `next build`.
- Evidence:
  - `src/app/catalog/layout.tsx`
  - `src/app/favorites/layout.tsx`
  - `src/widgets/catalog/CatalogLayout.tsx`
  - `src/widgets/catalog/PetIndex.tsx`
  - `src/widgets/catalog/SeriesIndex.tsx`
  - `src/widgets/home/Homepage.widgets.tsx`
  - `src/widgets/info/infoTheme.ts`
- Exit Criteria:
  - Нет TS2613/TS2307 в output `npx tsc --noEmit`.
  - `npm run build` зелёный без import/export build blockers.
- Updates:
  - `2026-04-07`: проблема зафиксирована по результатам reality-check.

### MONUI-012 — Рассинхрон docs-трекеров с фактическим статусом сборки
- Status: `Resolved`
- Priority: `P0`
- Area: Program Governance
- Opened: `2026-04-07`
- Updated: `2026-04-08`
- Description:
  - В документации отмечены закрытые фазы и зелёные verification gates, но текущая проверка показывает обратное.
  - Это мешает планированию миграции и создаёт ложное ощущение готовности.
- Evidence:
  - `docs/phase-1-4-closure-checklist.md`
  - `docs/stages-tracker.md`
  - `docs/migration-gap-register-2026-04-07.md`
- Exit Criteria:
  - Все “Done” статусы синхронизированы с фактическими проверками.
  - На каждый red-gate существует открытая карточка и привязанный stage/task.
- Updates:
  - `2026-04-07`: проблема зафиксирована.

### MONUI-013 — E2E smoke не запускается в окружении (Playwright browsers missing)
- Status: `Open`
- Priority: `P1`
- Area: QA / CI
- Opened: `2026-04-07`
- Updated: `2026-04-07`
- Description:
  - Playwright smoke tests не стартуют, так как отсутствуют бинарники браузера.
  - Верификация e2e-фазы фактически заблокирована окружением.
- Evidence:
  - `e2e/smoke.spec.ts`
  - `playwright.config.ts`
  - `npm run test:e2e` output (`Executable doesn't exist ... npx playwright install`)
- Exit Criteria:
  - В CI и локально выполняется `npx playwright install` (или prebuilt cache).
  - `npm run test:e2e` исполним и выдаёт валидный test result.
- Updates:
  - `2026-04-07`: проблема зафиксирована.

### MONUI-010 — Detail-route с невалидным id отвечает `200` вместо `404`
- Status: `Resolved`
- Priority: `P1`
- Area: Routing / Error Semantics
- Opened: `2026-04-05`
- Updated: `2026-04-05`
- Description:
  - Для `catalog` detail-роутов с несуществующим `internal_id` сервер отвечает `200`, а не `404`.
  - Это ухудшает SEO-сигналы и поведение мониторинга/алертов.
- Evidence:
  - `src/app/catalog/r/[internal_id]/page.tsx`
  - `src/app/catalog/c/[internal_id]/page.tsx`
  - `src/app/catalog/s/[internal_id]/page.tsx`
  - `src/app/catalog/p/[internal_id]/page.tsx`
- Exit Criteria:
  - Для невалидного `internal_id` detail-роуты возвращают корректный `404`.
  - Поведение согласовано между HTML-ответом, metadata и not-found UI.
- Updates:
  - `2026-04-05`: обнаружено в smoke-check (invalid id отдаёт `200`).
  - `2026-04-05`: исправлено — invalid `internal_id` на `/catalog/r|c|s|p/*` возвращает HTTP `404` (валидные id остаются `200`).

---

## Шаблон для новой проблемы
Скопируй блок, замени `MONUI-XXX` и поля.

```md
### MONUI-XXX — Короткое название
- Status: `Open`
- Priority: `P2`
- Area: <area>
- Opened: `YYYY-MM-DD`
- Updated: `YYYY-MM-DD`
- Description:
  - <что не так>
- Evidence:
  - `<path/to/file>`
- Exit Criteria:
  - <критерий 1>
  - <критерий 2>
- Updates:
  - `YYYY-MM-DD`: создана карточка.
```
