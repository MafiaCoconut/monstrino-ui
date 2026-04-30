import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// ─── FSD layer definitions ────────────────────────────────────────────────────
// Strict layering: app → widgets → features → entities → shared
// Each layer may only import from layers below it.

const FSD_ELEMENTS = [
  { type: "app",      pattern: "src/app/**" },
  { type: "widgets",  pattern: "src/widgets/**" },
  { type: "features", pattern: "src/features/**" },
  { type: "entities", pattern: "src/entities/**" },
  { type: "shared",   pattern: "src/shared/**" },
  { type: "cards",    pattern: "src/cards/**" },       // legacy, treated as widgets
];

const FSD_RULES = [
  // app can import from anything below
  { from: "app",      allow: ["widgets", "features", "entities", "shared", "cards"] },
  // widgets can import from features and below
  { from: "widgets",  allow: ["features", "entities", "shared", "cards"] },
  // cards (legacy) same as widgets
  { from: "cards",    allow: ["features", "entities", "shared"] },
  // features can import from entities and shared
  { from: "features", allow: ["entities", "shared"] },
  // entities can import from shared only
  { from: "entities", allow: ["shared"] },
  // shared imports nothing from feature layers
  { from: "shared",   allow: [] },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ─── eslint-plugin-boundaries ─────────────────────────────────────────────
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": FSD_ELEMENTS,

      "boundaries/ignore": [
        // Legacy code with known cross-layer imports — to be cleaned up
        "src/shared/legacy-types/**",
        "src/data/**",
        "src/sections/**",
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "warn",
        { default: "disallow", rules: FSD_RULES },
      ],
    },
  },

  // ─── Global ignores ───────────────────────────────────────────────────────
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "ui-old/**",
    "src/pages-for-future/**",
    "src/data/real-data/**",
  ]),
]);

export default eslintConfig;
