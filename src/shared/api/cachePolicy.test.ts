import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RELEASE_MAX_STALE_SECONDS,
  RELEASE_MAX_STALE_MS,
  RELEASE_LIST_TAG,
  releaseDetailTag,
} from "./cachePolicy";
import { successEnvelope } from "@/__tests__/msw/handlers";
import { getReleaseBySlug, getReleasesPage } from "./resources/releases";
import { MOCK_RELEASES } from "@/__mocks__/entities";

type CapturedInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

function stubFetchCapturing(data: unknown): CapturedInit[] {
  const captured: CapturedInit[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: unknown, init?: CapturedInit) => {
      captured.push(init ?? {});
      return new Response(JSON.stringify(successEnvelope(data)), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }),
  );
  return captured;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("release visibility cache policy", () => {
  it("bounds automatic staleness of active release data to 5 minutes", () => {
    expect(RELEASE_MAX_STALE_SECONDS).toBeLessThanOrEqual(300);
    expect(RELEASE_MAX_STALE_MS).toBe(RELEASE_MAX_STALE_SECONDS * 1000);
  });

  it("server detail fetch uses the policy TTL and slug-derived cache tags", async () => {
    const captured = stubFetchCapturing(MOCK_RELEASES[0]);

    await getReleaseBySlug("kill-switch-slug", { context: "server" });

    expect(captured).toHaveLength(1);
    const next = captured[0].next;
    expect(next?.revalidate).toBeLessThanOrEqual(RELEASE_MAX_STALE_SECONDS);
    expect(next?.tags).toContain(releaseDetailTag("kill-switch-slug"));
    expect(next?.tags).toContain(RELEASE_LIST_TAG);
  });

  it("server list fetch uses the policy TTL and the list cache tag", async () => {
    const captured = stubFetchCapturing({
      items: MOCK_RELEASES,
      total: MOCK_RELEASES.length,
      page: 1,
      page_size: 12,
    });

    await getReleasesPage({ page: 1, pageSize: 12 }, { context: "server" });

    expect(captured).toHaveLength(1);
    const next = captured[0].next;
    expect(next?.revalidate).toBeLessThanOrEqual(RELEASE_MAX_STALE_SECONDS);
    expect(next?.tags).toContain(RELEASE_LIST_TAG);
  });

  it("builds the detail tag from the API slug", () => {
    expect(releaseDetailTag("frankie-core-0001")).toBe("release-frankie-core-0001");
  });
});
