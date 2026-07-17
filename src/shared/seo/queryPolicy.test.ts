import { describe, expect, it } from "vitest";
import {
  classifyQueryParam,
  isIndexableWithParams,
  canonicalPathForParams,
} from "./queryPolicy";

describe("classifyQueryParam", () => {
  it("classifies tracking params", () => {
    expect(classifyQueryParam("utm_source")).toBe("tracking");
    expect(classifyQueryParam("utm_whatever")).toBe("tracking");
    expect(classifyQueryParam("gclid")).toBe("tracking");
    expect(classifyQueryParam("fbclid")).toBe("tracking");
  });

  it("classifies sorting/pagination/ui params", () => {
    expect(classifyQueryParam("sort")).toBe("sorting");
    expect(classifyQueryParam("order")).toBe("sorting");
    expect(classifyQueryParam("page")).toBe("pagination");
    expect(classifyQueryParam("view")).toBe("ui-only");
  });

  it("treats unknown params as filtering (fail closed)", () => {
    expect(classifyQueryParam("character")).toBe("filtering");
    expect(classifyQueryParam("anything_else")).toBe("filtering");
  });
});

describe("isIndexableWithParams", () => {
  it("indexable with no params", () => {
    expect(isIndexableWithParams(undefined)).toBe(true);
    expect(isIndexableWithParams({})).toBe(true);
  });

  it("indexable with only tracking/ui params", () => {
    expect(isIndexableWithParams({ utm_source: "x", view: "grid" })).toBe(true);
  });

  it("noindex for filters, sorting, pagination and search", () => {
    expect(isIndexableWithParams({ page: "2" })).toBe(false);
    expect(isIndexableWithParams({ sort: "year" })).toBe(false);
    expect(isIndexableWithParams({ q: "draculaura" })).toBe(false);
    expect(isIndexableWithParams({ character: "frankie", utm_source: "x" })).toBe(false);
  });
});

describe("canonicalPathForParams", () => {
  it("canonical is always the clean base path", () => {
    expect(canonicalPathForParams("/catalog/r")).toBe("/catalog/r");
  });
});
