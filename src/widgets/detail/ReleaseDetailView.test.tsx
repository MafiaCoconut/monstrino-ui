import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReleaseDetailView } from "./ReleaseDetailView";

describe("ReleaseDetailView", () => {
  it("renders canonical release data and placeholder image fallback", () => {
    render(
      <ReleaseDetailView
        model={{
          id: "1" as never,
          slug: "frankie-stein-basic-000000000001",
          title: "Frankie Stein Basic",
          code: "frankie-stein-basic",
          mpn: "FRANKIE-001",
          year: 2010,
          description: "Classic Frankie release.",
          textFromBox: "Back of box copy.",
          images: [],
        }}
      />,
    );

    expect(screen.getByText("Frankie Stein Basic")).toBeTruthy();
    expect(screen.getByText("frankie-stein-basic-000000000001")).toBeTruthy();
    expect(screen.getByText("Back of box copy.")).toBeTruthy();
    expect(screen.getByAltText("Frankie Stein Basic").getAttribute("src")).toContain(
      "placeholder-release.svg",
    );
  });
});
