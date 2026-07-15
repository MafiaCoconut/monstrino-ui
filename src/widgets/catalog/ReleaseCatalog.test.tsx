import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ReleaseCatalog from "./ReleaseCatalog";

const useReleasesPage = vi.fn();

vi.mock("@/shared/api/hooks", () => ({
  useReleasesPage: (...args: unknown[]) => useReleasesPage(...args),
}));

describe("ReleaseCatalog", () => {
  it("shows loading state", () => {
    useReleasesPage.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = render(<ReleaseCatalog />);
    expect(screen.getByText("Releases Catalog")).toBeTruthy();
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
  });

  it("shows success state", () => {
    useReleasesPage.mockReturnValue({
      data: {
        items: [
          {
            id: "1",
            slug: "frankie-stein-basic-000000000001",
            title: "Frankie Stein Basic",
            code: "frankie-stein-basic",
            images: [],
          },
        ],
        total: 1,
        page: 1,
        page_size: 12,
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<ReleaseCatalog />);
    expect(screen.getByText("Frankie Stein Basic")).toBeTruthy();
    expect(screen.getByText("1 public release")).toBeTruthy();
  });

  it("shows empty state", () => {
    useReleasesPage.mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        page_size: 12,
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<ReleaseCatalog />);
    expect(screen.getByText("No releases yet")).toBeTruthy();
  });

  it("shows error state", () => {
    useReleasesPage.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<ReleaseCatalog />);
    expect(screen.getByText("Failed to load releases")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});
