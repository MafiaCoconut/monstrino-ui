import { describe, expect, it } from "vitest";
import { characterFromApiDto, characterToSummary } from "./mapper";
import { MOCK_CHARACTERS } from "@/__mocks__/entities";

const validDto = MOCK_CHARACTERS[0];

describe("characterFromApiDto", () => {
  it("maps a valid DTO to a CharacterModel", () => {
    const model = characterFromApiDto(validDto);
    expect(model.id).toBe("101");
    expect(model.name).toBe("Frankie Stein");
    expect(model.species).toBe("Frankenstein's Monster");
    expect(model.releaseCount).toBe(45);
    expect(model.generations).toEqual(["G1", "G2", "G3"]);
    expect(model.seriesAppearances).toEqual(["Original Monster High", "Boo York", "Electrified"]);
    expect(model.tags).toEqual(["Main Character"]);
    expect(model.imageUrl).toBeUndefined();
    expect(model.accentColor).toBeUndefined();
  });

  it("falls back to name when display_name is absent", () => {
    const model = characterFromApiDto({ ...validDto, display_name: null });
    expect(model.displayName).toBe("Frankie Stein");
  });

  it("converts numeric id to string", () => {
    const model = characterFromApiDto({ ...validDto, id: 999 });
    expect(model.id).toBe("999");
  });

  it("filters out invalid generation values", () => {
    const model = characterFromApiDto({ ...validDto, generations: ["G1", "G99", "G2"] });
    expect(model.generations).toEqual(["G1", "G2"]);
  });

  it("prefixes accent_color with # when missing", () => {
    const model = characterFromApiDto({ ...validDto, accent_color: "FF00FF" });
    expect(model.accentColor).toBe("#FF00FF");
  });

  it("preserves accent_color that already has #", () => {
    const model = characterFromApiDto({ ...validDto, accent_color: "#AABBCC" });
    expect(model.accentColor).toBe("#AABBCC");
  });

  it("defaults generations and tags to empty arrays when null", () => {
    const model = characterFromApiDto({ ...validDto, generations: null, tags: null });
    expect(model.generations).toEqual([]);
    expect(model.tags).toEqual([]);
  });

  it("defaults seriesAppearances to empty array when null", () => {
    const model = characterFromApiDto({ ...validDto, series_appearances: null });
    expect(model.seriesAppearances).toEqual([]);
  });

  it("throws for non-object input", () => {
    expect(() => characterFromApiDto(null)).toThrow();
  });
});

describe("characterToSummary", () => {
  it("maps a model to its summary shape", () => {
    const model = characterFromApiDto(validDto);
    const summary = characterToSummary(model);
    expect(summary.id).toBe(model.id);
    expect(summary.name).toBe(model.name);
    expect(summary.species).toBe(model.species);
    expect(Object.keys(summary)).not.toContain("description");
    expect(Object.keys(summary)).not.toContain("generations");
  });
});
