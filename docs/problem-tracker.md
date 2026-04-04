# Monstrino UI — Реестр проблем и статусов

Обновлено: 2026-04-04

## Назначение
Этот файл хранит технические проблемы проекта, их текущий статус и историю изменений.

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
| MONUI-001 | Сломан `lint` (несовместимость ESLint/Next config) | P0 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-002 | Двойной источник данных (API + mock в runtime UI) | P0 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-003 | God-components и чрезмерно крупные файлы (Release/Index/Catalog) | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-004 | Дублирование роутов и page-логики | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-005 | Фрагментация дизайн-системы и токенов | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-006 | Низкая типобезопасность (`any`, нестрогая нормализация API) | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-007 | Технический шум/legacy-артефакты в репозитории | P2 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-008 | Нет тестов (unit/integration/e2e) и тестового контура | P1 | Open | 2026-04-04 | 2026-04-04 |
| MONUI-009 | Архитектурный дрейф относительно ARCHITECTURE.md | P2 | Open | 2026-04-04 | 2026-04-04 |

---

## Карточки проблем

### MONUI-001 — Сломан `lint` (несовместимость ESLint/Next config)
- Status: `Open`
- Priority: `P0`
- Area: Tooling / CI
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - `npm run lint` падает из-за импорта `eslint-config-next/core-web-vitals`.
- Evidence:
  - `eslint.config.mjs`
  - `package.json`
- Exit Criteria:
  - `npm run lint` проходит локально и в CI.
  - Версии eslint и eslint-config-next согласованы с Next 16.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-002 — Двойной источник данных (API + mock в runtime UI)
- Status: `Open`
- Priority: `P0`
- Area: Data Flow / Architecture
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - SEO/page-level загрузка использует API, но крупные client-экраны рендерятся из `src/data/real-data/*`.
  - Возможна рассинхронизация данных между метаданными и UI.
- Evidence:
  - `src/app/catalog/r/[internal_id]/page.tsx`
  - `src/shared/data/DetailDataHydrator.tsx`
  - `src/release-hub/Index/ReleaseIndex.tsx`
- Exit Criteria:
  - Единый источник истины для detail/catalog страниц.
  - Моки остаются только как dev fixtures/fallback по явной стратегии.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

### MONUI-003 — God-components и крупные файлы
- Status: `Open`
- Priority: `P1`
- Area: Frontend Structure
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Крупные страницы содержат и data logic, и UI composition, и локальные nested-компоненты.
- Evidence:
  - `src/release-hub/Index/ReleaseIndex.tsx`
  - `src/release-hub/Catalog/ReleaseCatalog.tsx`
  - `src/release-hub/Index/SeriesIndex.tsx`
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

### MONUI-008 — Нет тестового контура
- Status: `Open`
- Priority: `P1`
- Area: Quality / Reliability
- Opened: `2026-04-04`
- Updated: `2026-04-04`
- Description:
  - Нет unit/integration/e2e тестов и связанного пайплайна.
- Evidence:
  - Отсутствуют `*.test.*`, `*.spec.*`, `vitest/jest/playwright` конфиги.
- Exit Criteria:
  - Базовый тестовый стек подключен и запускается в CI.
  - Ключевые сценарии покрыты smoke/e2e тестами.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

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
  - `src/release-hub/*`
- Exit Criteria:
  - Зафиксирован plan migration + правила контроля зависимостей слоев.
- Updates:
  - `2026-04-04`: проблема зафиксирована.

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
