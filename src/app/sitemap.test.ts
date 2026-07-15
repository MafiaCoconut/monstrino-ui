import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReleaseApiDto, ReleasePageApiDto } from "@entities/release";

const {
  getReleasesPageMock,
  getSeriesListMock,
  getCharactersListMock,
  getPetsListMock,
} = vi.hoisted(() => ({
  getReleasesPageMock: vi.fn(),
  getSeriesListMock: vi.fn(),
  getCharactersListMock: vi.fn(),
  getPetsListMock: vi.fn(),
}));

vi.mock("@/shared/seo/siteUrl", () => ({
  getSiteUrl: () => "https://monstrino.test",
}));

vi.mock("@/shared/api/resources", () => ({
  getReleasesPage: getReleasesPageMock,
  getSeriesList: getSeriesListMock,
  getCharactersList: getCharactersListMock,
  getPetsList: getPetsListMock,
}));

import sitemap from "./sitemap";

function makeRelease(index: number, slug = `release-${index}`): ReleaseApiDto {
  return {
    id: String(index),
    slug,
    title: `Release ${index}`,
    code: `release-${index}`,
    updated_at: "2024-01-01T00:00:00Z",
  };
}

function makePage(items: ReleaseApiDto[], total: number, page: number): ReleasePageApiDto {
  return {
    items,
    total,
    page,
    page_size: 100,
  };
}

function releaseUrls(entries: Awaited<ReturnType<typeof sitemap>>): string[] {
  return entries
    .map((entry) => entry.url)
    .filter((url) => url.startsWith("https://monstrino.test/catalog/r/"));
}

beforeEach(() => {
  vi.clearAllMocks();
  getSeriesListMock.mockResolvedValue([]);
  getCharactersListMock.mockResolvedValue([]);
  getPetsListMock.mockResolvedValue([]);
});

describe("sitemap release pagination", () => {
  it("handles an empty catalog", async () => {
    getReleasesPageMock.mockResolvedValueOnce(makePage([], 0, 1));

    const entries = await sitemap();

    expect(releaseUrls(entries)).toEqual([]);
    expect(getReleasesPageMock).toHaveBeenCalledTimes(1);
  });

  it("handles catalogs smaller than 100 releases", async () => {
    getReleasesPageMock.mockResolvedValueOnce(makePage([makeRelease(1), makeRelease(2)], 2, 1));

    const entries = await sitemap();

    expect(releaseUrls(entries)).toEqual([
      "https://monstrino.test/catalog/r/release-1",
      "https://monstrino.test/catalog/r/release-2",
    ]);
    expect(getReleasesPageMock).toHaveBeenCalledTimes(1);
  });

  it("handles exactly 100 releases without fetching an extra page", async () => {
    getReleasesPageMock.mockResolvedValueOnce(
      makePage(Array.from({ length: 100 }, (_, index) => makeRelease(index + 1)), 100, 1),
    );

    const entries = await sitemap();

    expect(releaseUrls(entries)).toHaveLength(100);
    expect(getReleasesPageMock).toHaveBeenCalledTimes(1);
  });

  it("handles catalogs larger than 100 releases", async () => {
    getReleasesPageMock
      .mockResolvedValueOnce(
        makePage(Array.from({ length: 100 }, (_, index) => makeRelease(index + 1)), 101, 1),
      )
      .mockResolvedValueOnce(makePage([makeRelease(101)], 101, 2));

    const entries = await sitemap();

    expect(releaseUrls(entries)).toHaveLength(101);
    expect(getReleasesPageMock).toHaveBeenCalledTimes(2);
  });

  it("loads multiple pages sequentially until total is reached", async () => {
    getReleasesPageMock
      .mockResolvedValueOnce(makePage([makeRelease(1), makeRelease(2)], 5, 1))
      .mockResolvedValueOnce(makePage([makeRelease(3), makeRelease(4)], 5, 2))
      .mockResolvedValueOnce(makePage([makeRelease(5)], 5, 3));

    const entries = await sitemap();

    expect(releaseUrls(entries)).toEqual([
      "https://monstrino.test/catalog/r/release-1",
      "https://monstrino.test/catalog/r/release-2",
      "https://monstrino.test/catalog/r/release-3",
      "https://monstrino.test/catalog/r/release-4",
      "https://monstrino.test/catalog/r/release-5",
    ]);
    expect(getReleasesPageMock.mock.calls.map(([params]) => params.page)).toEqual([1, 2, 3]);
  });

  it("handles exact page multiples", async () => {
    getReleasesPageMock
      .mockResolvedValueOnce(
        makePage(Array.from({ length: 100 }, (_, index) => makeRelease(index + 1)), 200, 1),
      )
      .mockResolvedValueOnce(
        makePage(Array.from({ length: 100 }, (_, index) => makeRelease(index + 101)), 200, 2),
      );

    const entries = await sitemap();

    expect(releaseUrls(entries)).toHaveLength(200);
    expect(getReleasesPageMock).toHaveBeenCalledTimes(2);
  });

  it("deduplicates duplicate slugs defensively", async () => {
    getReleasesPageMock.mockResolvedValueOnce(
      makePage([makeRelease(1, "shared"), makeRelease(2, "shared"), makeRelease(3, "unique")], 2, 1),
    );

    const entries = await sitemap();

    expect(releaseUrls(entries)).toEqual([
      "https://monstrino.test/catalog/r/shared",
      "https://monstrino.test/catalog/r/unique",
    ]);
  });

  it("fails when pagination stops making progress before total is reached", async () => {
    getReleasesPageMock
      .mockResolvedValueOnce(makePage([makeRelease(1), makeRelease(2)], 3, 1))
      .mockResolvedValueOnce(makePage([makeRelease(1), makeRelease(2)], 3, 2));

    await expect(sitemap()).rejects.toThrow("made no progress");
  });

  it("propagates release API failures", async () => {
    getReleasesPageMock.mockRejectedValueOnce(new Error("release API down"));

    await expect(sitemap()).rejects.toThrow("release API down");
  });
});
