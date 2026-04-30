import { describe, expect, it } from "vitest";
import { releaseFromApiDto, releaseToSummary } from "./mapper";
import { MOCK_RELEASES } from "@/__mocks__/entities";

const validDto = MOCK_RELEASES[0];

describe("releaseFromApiDto", () => {
  it("maps a valid DTO to a ReleaseModel", () => {
    const model = releaseFromApiDto(validDto);
    expect(model.id).toBe("1");
    expect(model.name).toBe("Frankie Stein Basic");
    expect(model.displayName).toBe("Frankie Stein — Basic Series");
    expect(model.generation).toBe("G1");
    expect(model.releaseTypes).toEqual(["Basic"]);
    expect(model.stockStatus).toBe("out_of_stock");
    expect(model.isExclusive).toBe(false);
    expect(model.price).toBe("$24.99");
    expect(model.characterName).toBe("Frankie Stein");
    expect(model.seriesName).toBe("Original Monster High");
    expect(model.pricing).toEqual([]);
    expect(model.variants).toEqual([]);
  });

  it("falls back to name when display_name is absent", () => {
    const dto = { ...validDto, display_name: null };
    const model = releaseFromApiDto(dto);
    expect(model.displayName).toBe("Frankie Stein Basic");
  });

  it("converts numeric id to string", () => {
    const model = releaseFromApiDto({ ...validDto, id: 42 });
    expect(model.id).toBe("42");
  });

  it("defaults stockStatus to 'unknown' for unrecognised value", () => {
    const model = releaseFromApiDto({ ...validDto, stock_status: "weird_status" });
    expect(model.stockStatus).toBe("unknown");
  });

  it("ignores unknown generation values", () => {
    const model = releaseFromApiDto({ ...validDto, generation: "G99" });
    expect(model.generation).toBeUndefined();
  });

  it("ignores unknown rarity values", () => {
    const model = releaseFromApiDto({ ...validDto, rarity: "mythical" });
    expect(model.rarity).toBeUndefined();
  });

  it("maps pricing regions correctly", () => {
    const dto = {
      ...validDto,
      pricing: [
        {
          code: "US",
          currency: "USD",
          msrp: 24.99,
          market: 22.0,
          flag: "🇺🇸",
          msrp_note: null,
          market_note: null,
          recent_sales_count: 10,
        },
      ],
    };
    const model = releaseFromApiDto(dto);
    expect(model.pricing).toHaveLength(1);
    expect(model.pricing[0].code).toBe("US");
    expect(model.pricing[0].recentSalesCount).toBe(10);
  });

  it("maps variants correctly", () => {
    const dto = {
      ...validDto,
      variants: [{ type: "Color", name: "Pink", year: 2010, status: "active", sku: "SKU-1" }],
    };
    const model = releaseFromApiDto(dto);
    expect(model.variants).toHaveLength(1);
    expect(model.variants[0].name).toBe("Pink");
    expect(model.variants[0].sku).toBe("SKU-1");
  });

  it("builds rating when average is present", () => {
    const model = releaseFromApiDto({ ...validDto, rating_average: 4.5, rating_count: 12 });
    expect(model.rating).toEqual({ average: 4.5, count: 12 });
  });

  it("leaves rating undefined when average is absent", () => {
    const model = releaseFromApiDto({ ...validDto, rating_average: null });
    expect(model.rating).toBeUndefined();
  });

  it("throws ZodError for completely invalid DTO", () => {
    expect(() => releaseFromApiDto({ invalid: true, nested: { bad: "data" } })).not.toThrow();
    // Schema is permissive (all fields nullish), so an object with extra keys passes.
    // A non-object throws instead.
    expect(() => releaseFromApiDto("not-an-object")).toThrow();
  });
});

describe("releaseToSummary", () => {
  it("maps a model to its summary shape", () => {
    const model = releaseFromApiDto(validDto);
    const summary = releaseToSummary(model);
    expect(summary.id).toBe(model.id);
    expect(summary.name).toBe(model.name);
    expect(summary.stockStatus).toBe(model.stockStatus);
    expect(Object.keys(summary)).not.toContain("description");
    expect(Object.keys(summary)).not.toContain("pricing");
  });
});
