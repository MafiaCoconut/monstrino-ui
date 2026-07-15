import { describe, expect, it } from "vitest";
import { releaseFromApiDto, releaseToSummary } from "./mapper";
import { MOCK_RELEASES } from "@/__mocks__/entities";

const validDto = MOCK_RELEASES[0];

describe("releaseFromApiDto", () => {
  it("maps a valid DTO to a ReleaseModel", () => {
    const model = releaseFromApiDto(validDto);
    expect(model.id).toBe("1");
    expect(model.slug).toBe("frankie-stein-basic-000000000001");
    expect(model.title).toBe("Frankie Stein Basic");
    expect(model.code).toBe("frankie-stein-basic");
    expect(model.mpn).toBe("FRANKIE-001");
    expect(model.images).toEqual([]);
  });

  it("keeps nullable optional fields undefined in the model", () => {
    const dto = { ...validDto, mpn: null, description: null, text_from_box: null };
    const model = releaseFromApiDto(dto);
    expect(model.mpn).toBeUndefined();
    expect(model.description).toBeUndefined();
    expect(model.textFromBox).toBeUndefined();
  });

  it("throws ZodError for invalid DTOs", () => {
    expect(() => releaseFromApiDto({ invalid: true })).toThrow();
    expect(() => releaseFromApiDto("not-an-object")).toThrow();
  });
});

describe("releaseToSummary", () => {
  it("maps a model to its summary shape", () => {
    const model = releaseFromApiDto(validDto);
    const summary = releaseToSummary(model);
    expect(summary.id).toBe(model.id);
    expect(summary.slug).toBe(model.slug);
    expect(summary.title).toBe(model.title);
    expect(summary.code).toBe(model.code);
  });
});
