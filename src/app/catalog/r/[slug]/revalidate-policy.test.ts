import { describe, expect, it } from "vitest";
import { RELEASE_MAX_STALE_SECONDS } from "@shared/api/cachePolicy";

describe("release detail ISR policy", () => {
  it("route revalidate does not exceed the visibility cache policy bound", async () => {
    const page = await import("./page");
    expect(typeof page.revalidate).toBe("number");
    expect(page.revalidate).toBeLessThanOrEqual(RELEASE_MAX_STALE_SECONDS);
  });
});
