import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Loading from "./loading";
import NotFound from "./not-found";
import ErrorPage from "./error";

describe("release route state pages", () => {
  it("renders loading state", () => {
    render(<Loading />);
    expect(screen.getByText("Loading release")).toBeTruthy();
  });

  it("renders not-found state", () => {
    render(<NotFound />);
    expect(screen.getByText("Release not found")).toBeTruthy();
  });

  it("renders generic error state", () => {
    render(<ErrorPage error={new Error("boom")} reset={vi.fn()} />);
    expect(screen.getByText("Failed to load release")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});
