# Monstrino UI — Migration Gap Register (Reality Check)

Обновлено: 2026-04-07

## Цель
Зафиксировать фактические расхождения между roadmap/trackers и текущим состоянием кода, чтобы вести миграцию как управляемый backlog.

## Проверка (2026-04-07)
Команды:
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test
npm run test:e2e
```

Результат (snapshot 2026-04-07):
- `lint`: fail (`26 errors`, `160 warnings`)
- `tsc`: fail
- `build`: fail
- `test` (Vitest): pass (`83/83`)
- `test:e2e` (Playwright): fail (не установлены браузеры)

## Проверка (2026-04-08) — после фиксов
```bash
npm run lint      # → 0 errors, 63 warnings (unused vars + boundaries selector notice)
npx tsc --noEmit  # → PASS (0 errors)
npm run build     # → PASS (✓ Compiled successfully)
npm run test      # → PASS (83/83)
npm run test:e2e  # → FAIL (браузеры не установлены, требуется: npx playwright install)
```

## Реестр расхождений

| Gap ID | Priority | Фаза | Статус | Что не так | Evidence | Exit Criteria |
|---|---|---|---|---|---|---|
| GAP-001 | P0 | Phase 0/1 | Resolved | Глобальные quality-gates не зелёные (`lint/tsc/build`) при отмеченном Done в closure docs | `docs/phase-1-4-closure-checklist.md`, `/tmp/mon_lint.log`, `/tmp/mon_tsc.log`, `/tmp/mon_build.log` | Все 3 команды стабильны локально и в CI |
| GAP-002 | P0 | Phase 7 | Resolved | `CatalogLayout` импортируется как default, но экспортируется как named | `src/app/catalog/layout.tsx`, `src/app/favorites/layout.tsx`, `src/widgets/catalog/CatalogLayout.tsx` | Единый контракт экспорта/импорта; `tsc/build` без TS2613 |
| GAP-003 | P0 | Phase 7 | Resolved | Остались битые пути после удаления `release-hub` (`../entities/*`, `./entities`, `../designTokens`) | `src/widgets/catalog/PetIndex.tsx`, `src/widgets/catalog/SeriesIndex.tsx`, `src/widgets/home/Homepage.widgets.tsx`, `src/widgets/info/infoTheme.ts` | Нет TS2307 unresolved modules |
| GAP-004 | P1 | Phase 1/7 | Resolved | `pages-for-future/*` участвует в типизации и ломает `tsc` (TS7053) | `src/pages-for-future/admin_panel/MonstrinoAdminV4(1).tsx` | Директория исключена из tsconfig scope (`exclude`); tsc чистый |
| GAP-005 | P1 | Phase 2/4 | Open | Смешанный рендер `legacy/new` по `useMockData`; визуальный дрейф между страницами | `.env.local`, `src/app/catalog/c/page.tsx`, `src/app/catalog/s/page.tsx`, `src/app/catalog/p/page.tsx`, `src/app/catalog/r/page.tsx` | Явная policy по mock-mode + согласованный рендер для всех каталогов |
| GAP-006 | P1 | Phase 2/4 | Open | Home и часть index-виджетов всё ещё читают `src/data/real-data/*`; источник данных неоднороден | `src/widgets/home/Homepage.widgets.tsx`, `src/widgets/catalog/ReleaseIndex.tsx`, `src/widgets/catalog/CharacterIndex.tsx`, `src/widgets/catalog/SeriesIndex.tsx`, `src/widgets/catalog/PetIndex.tsx` | UI и SEO используют согласованный data-flow, моки только по явной стратегии |
| GAP-007 | P1 | Phase 6 | Open | E2E smoke тесты не исполнимы в текущем окружении (`playwright install` не выполнен) | `e2e/smoke.spec.ts`, `playwright.config.ts` | `npm run test:e2e` запускается и даёт предсказуемый результат |
| GAP-008 | P2 | Phase 7 | Resolved | Boundaries-конфиг частично устарел (`element-types` deprecated), resolver шумит | `eslint.config.mjs`, вывод `npm run lint` | Правила мигрированы на `boundaries/dependencies`; `eslint-import-resolver-typescript` установлен; resolver warning устранён |
| GAP-009 | P2 | Governance | Resolved | Tracker/Checklist отражают 98%/100% при красных gate и незавершённых импорт-миграциях | `docs/stages-tracker.md`, `docs/phase-1-4-closure-checklist.md` | Docs обновлены по факту верификации 2026-04-08 |

## Приоритетный план закрытия
1. Закрыть `GAP-002` и `GAP-003` (блокируют `tsc/build`).
2. Закрыть `GAP-001` минимум до состояния: `lint` без errors, `tsc/build` зелёные.
3. Зафиксировать policy для `GAP-005`/`GAP-006` (какой режим считается canonical).
4. Привести `GAP-009` (docs-sync) сразу после фиксов, чтобы не копить drift.
5. Довести `GAP-007`/`GAP-008` как quality hardening.

## Примечание по visual drift
Ключевая причина отличий в UI на текущем стенде: `.env.local` содержит `NEXT_PUBLIC_USE_MOCK_DATA=true`, и каталоги `c/s/p` переключаются на `*Legacy` компоненты, тогда как `r` уже в новом потоке.
