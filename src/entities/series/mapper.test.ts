import { describe, expect, it } from "vitest";
import { seriesFromApiDto, seriesToSummary } from "./mapper";
import { MOCK_SERIES } from "@/__mocks__/entities";

const validDto = MOCK_SERIES[0];

describe("seriesFromApiDto", () => {
  it("maps a valid DTO to a SeriesModel", () => {
    const model = seriesFromApiDto(validDto);
    expect(model.id).toBe("1");
    expect(model.name).toBe("Original Monster High");
    expect(model.displayName).toBe("Original Monster High (G1)");
    expect(model.generation).toBe("G1");
    expect(model.yearStart).toBe(2010);
    expect(model.yearEnd).toBe(2017);
    expect(model.releaseCount).toBe(200);
    expect(model.characterCount).toBe(40);
    expect(model.yearLabel).toBe("2010–2017");
    expect(model.colorPalette).toEqual([]);
    expect(model.dolls).toEqual([]);
  });

  it("falls back to name when display_name is absent", () => {
    const model = seriesFromApiDto({ ...validDto, display_name: null });
    expect(model.displayName).toBe("Original Monster High");
  });

  it("converts numeric id to string", () => {
    const model = seriesFromApiDto({ ...validDto, id: 5 });
    expect(model.id).toBe("5");
  });

  it("ignores unknown generation values", () => {
    const model = seriesFromApiDto({ ...validDto, generation: "G99" });
    expect(model.generation).toBeUndefined();
  });

  it("ignores unknown series_type values", () => {
    const model = seriesFromApiDto({ ...validDto, series_type: "Fake" });
    expect(model.seriesType).toBeUndefined();
  });

  it("maps color_palette correctly", () => {
    const dto = {
      ...validDto,
      color_palette: [{ hex: "#FF00FF", name: "Magenta" }],
    };
    const model = seriesFromApiDto(dto);
    expect(model.colorPalette).toHaveLength(1);
    expect(model.colorPalette[0].hex).toBe("#FF00FF");
    expect(model.colorPalette[0].name).toBe("Magenta");
  });

  it("maps dolls correctly", () => {
    const dto = {
      ...validDto,
      dolls: [
        {
          id: "10",
          release_id: "20",
          character: "Frankie Stein",
          variant: "Basic",
          rarity: null,
          year: 2010,
          msrp: "$24.99",
          image_url: null,
        },
      ],
    };
    const model = seriesFromApiDto(dto);
    expect(model.dolls).toHaveLength(1);
    expect(model.dolls[0].id).toBe("10");
    expect(model.dolls[0].releaseId).toBe("20");
    expect(model.dolls[0].msrp).toBe("$24.99");
  });

  it("maps pricing correctly", () => {
    const dto = {
      ...validDto,
      pricing: {
        msrp_range: "$20–$30",
        current_market_range: "$15–$50",
        rarity_distribution: { common: 70, rare: 20, ultra_rare: 10 },
        demand_level: "High",
      },
    };
    const model = seriesFromApiDto(dto);
    expect(model.pricing?.msrpRange).toBe("$20–$30");
    expect(model.pricing?.rarityDistribution?.ultraRare).toBe(10);
    expect(model.pricing?.demandLevel).toBe("High");
  });

  it("throws ZodError for non-object input", () => {
    expect(() => seriesFromApiDto("invalid")).toThrow();
  });
});

describe("seriesToSummary", () => {
  it("maps a model to its summary shape", () => {
    const model = seriesFromApiDto(validDto);
    const summary = seriesToSummary(model);
    expect(summary.id).toBe(model.id);
    expect(summary.name).toBe(model.name);
    expect(summary.releaseCount).toBe(model.releaseCount);
    expect(Object.keys(summary)).not.toContain("description");
    expect(Object.keys(summary)).not.toContain("dolls");
  });
});
