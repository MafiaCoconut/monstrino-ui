import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useRelease, useReleasesList, useReleasesPage } from "./useRelease";
import { useSeries, useSeriesList } from "./useSeries";
import { useCharacter, useCharactersList } from "./useCharacter";
import { usePet, usePetsList } from "./usePet";

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

// ─── Release hooks ────────────────────────────────────────────────────────────

describe("useRelease", () => {
  it("fetches and maps a release by slug", async () => {
    const { result } = renderHook(
      () => useRelease("frankie-stein-basic-000000000001"),
      { wrapper: wrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("1");
    expect(result.current.data?.title).toBe("Frankie Stein Basic");
    expect(result.current.data?.slug).toBe("frankie-stein-basic-000000000001");
  });

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => useRelease(undefined), { wrapper: wrapper() });
    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("enters error state for unknown slug", async () => {
    const { result } = renderHook(() => useRelease("missing-slug"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useReleasesPage", () => {
  it("fetches and maps a release page", async () => {
    const { result } = renderHook(() => useReleasesPage({ page: 1, pageSize: 12 }), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
  });
});

describe("useReleasesList", () => {
  it("fetches and maps a list of releases", async () => {
    const { result } = renderHook(() => useReleasesList(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].title).toBe("Frankie Stein Basic");
  });
});

// ─── Series hooks ─────────────────────────────────────────────────────────────

describe("useSeries", () => {
  it("fetches and maps a series by id", async () => {
    const { result } = renderHook(() => useSeries("1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("1");
    expect(result.current.data?.name).toBe("Original Monster High");
  });

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => useSeries(undefined), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useSeriesList", () => {
  it("fetches and maps a list of series summaries", async () => {
    const { result } = renderHook(() => useSeriesList(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe("Original Monster High");
  });
});

// ─── Character hooks ──────────────────────────────────────────────────────────

describe("useCharacter", () => {
  it("fetches and maps a character by id", async () => {
    const { result } = renderHook(() => useCharacter("101"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("101");
    expect(result.current.data?.name).toBe("Frankie Stein");
  });

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => useCharacter(undefined), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCharactersList", () => {
  it("fetches and maps a list of characters", async () => {
    const { result } = renderHook(() => useCharactersList(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });
});

// ─── Pet hooks ────────────────────────────────────────────────────────────────

describe("usePet", () => {
  it("fetches and maps a pet by id", async () => {
    const { result } = renderHook(() => usePet("1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("1");
    expect(result.current.data?.name).toBe("Watzit");
    expect(result.current.data?.species).toBe("Dog");
  });

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => usePet(undefined), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("usePetsList", () => {
  it("fetches and maps a list of pets", async () => {
    const { result } = renderHook(() => usePetsList(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe("Watzit");
  });
});
