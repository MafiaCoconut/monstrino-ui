import "@testing-library/dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw/server";

// ─── Environment ──────────────────────────────────────────────────────────────

process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:8000";
process.env.NEXT_PUBLIC_USE_MOCK_DATA = "false";

// ─── MSW ──────────────────────────────────────────────────────────────────────

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
