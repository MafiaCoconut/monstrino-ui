/**
 * @deprecated
 * This barrel is superseded by `src/entities/`.
 *
 * Migration status:
 *  - shared   → @entities/shared
 *  - release  → @entities/release
 *  - character → @entities/character
 *  - series   → @entities/series
 *  - pet      → @entities/pet
 *
 * Remaining consumers (to migrate in later phases):
 *  - src/data/real-data/ (Phase 2.7 — move to src/__mocks__/)
 *  - src/cards/release-card/ReleaseCardCharacter.tsx (Phase 7 — CharacterIndexRelease is page-specific)
 *
 * Do NOT add new imports from this file.
 */
export * from "./shared";
export * from "./release";
export * from "./character";
export * from "./series";
export * from "./pet";
