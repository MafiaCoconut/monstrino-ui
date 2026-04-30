import { describe, expect, it } from "vitest";
import { petFromApiDto, petToSummary } from "./mapper";
import { MOCK_PETS } from "@/__mocks__/entities";

const validDto = MOCK_PETS[0];

describe("petFromApiDto", () => {
  it("maps a valid DTO to a PetModel", () => {
    const model = petFromApiDto(validDto);
    expect(model.id).toBe("1");
    expect(model.name).toBe("Watzit");
    expect(model.species).toBe("Dog");
    expect(model.generation).toBe("G1");
    expect(model.rarity).toBe("common");
    expect(model.ownerName).toBe("Frankie Stein");
    expect(model.owners).toHaveLength(1);
    expect(model.owners[0].id).toBe("101");
    expect(model.owners[0].role).toBe("primary");
    expect(model.releases).toEqual([]);
  });

  it("falls back to name when display_name is absent", () => {
    const model = petFromApiDto({ ...validDto, display_name: null });
    expect(model.displayName).toBe("Watzit");
  });

  it("converts numeric id to string", () => {
    const model = petFromApiDto({ ...validDto, id: 7 });
    expect(model.id).toBe("7");
  });

  it("ignores unknown generation values", () => {
    const model = petFromApiDto({ ...validDto, generation: "G99" });
    expect(model.generation).toBeUndefined();
  });

  it("ignores unknown rarity values", () => {
    const model = petFromApiDto({ ...validDto, rarity: "legendary" });
    expect(model.rarity).toBeUndefined();
  });

  it("ignores unknown exclusivity values", () => {
    const model = petFromApiDto({ ...validDto, exclusivity: "weird" });
    expect(model.exclusivity).toBeUndefined();
  });

  it("recognises valid exclusivity values", () => {
    const model = petFromApiDto({ ...validDto, exclusivity: "exclusive" });
    expect(model.exclusivity).toBe("exclusive");
  });

  it("maps releases correctly", () => {
    const dto = {
      ...validDto,
      releases: [{ id: "10", name: "Watzit Release", year: 2011 }],
    };
    const model = petFromApiDto(dto);
    expect(model.releases).toHaveLength(1);
    expect(model.releases[0].id).toBe("10");
    expect(model.releases[0].year).toBe(2011);
  });

  it("defaults owners and releases to empty arrays when null", () => {
    const model = petFromApiDto({ ...validDto, owners: null, releases: null });
    expect(model.owners).toEqual([]);
    expect(model.releases).toEqual([]);
  });

  it("throws for non-object input", () => {
    expect(() => petFromApiDto(42)).toThrow();
  });
});

describe("petToSummary", () => {
  it("maps a model to its summary shape", () => {
    const model = petFromApiDto(validDto);
    const summary = petToSummary(model);
    expect(summary.id).toBe(model.id);
    expect(summary.name).toBe(model.name);
    expect(summary.species).toBe(model.species);
    expect(summary.generation).toBe(model.generation);
    expect(Object.keys(summary)).not.toContain("description");
    expect(Object.keys(summary)).not.toContain("owners");
  });
});
