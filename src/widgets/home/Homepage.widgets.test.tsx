import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeaturedReleasesSection } from "./Homepage.widgets";

const useReleasesPage = vi.fn();

vi.mock("@/shared/api/hooks", () => ({
  useReleasesPage: (...args: unknown[]) => useReleasesPage(...args),
}));

describe("FeaturedReleasesSection", () => {
  it("loads featured releases from the API page hook and links by slug", () => {
    useReleasesPage.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            slug: "frankie-stein-basic-000000000001",
            title: "Frankie Stein Basic",
            code: "frankie-stein-basic",
            mpn: "FRANKIE-001",
            year: 2010,
            primaryImageUrl: null,
          },
        ],
      },
      isPending: false,
      isError: false,
    });

    render(<FeaturedReleasesSection />);

    expect(useReleasesPage).toHaveBeenCalledWith({ page: 1, pageSize: 6 });
    expect(screen.getByText("Frankie Stein Basic")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /frankie stein basic/i }).getAttribute("href"),
    ).toBe("/catalog/r/frankie-stein-basic-000000000001");
  });

  it("shows empty state when the API returns no public releases", () => {
    useReleasesPage.mockReturnValue({
      data: { items: [] },
      isPending: false,
      isError: false,
    });

    render(<FeaturedReleasesSection />);

    expect(screen.getByText("No public releases yet.")).toBeTruthy();
  });

  it("shows error state when the API query fails", () => {
    useReleasesPage.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    render(<FeaturedReleasesSection />);

    expect(screen.getByText("Public releases are temporarily unavailable.")).toBeTruthy();
  });
});
