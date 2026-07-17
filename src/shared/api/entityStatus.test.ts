import { describe, expect, it } from "vitest";
import { classifyEntityError, isMissingEntity } from "./entityStatus";
import {
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  MalformedApiResponseError,
} from "./http/errors";

const api = (status: number) => new ApiError("boom", "HTTP_ERROR", status);

describe("classifyEntityError", () => {
  it("maps HTTP statuses to entity outcomes", () => {
    expect(classifyEntityError(api(404)).kind).toBe("not-found");
    expect(classifyEntityError(api(410)).kind).toBe("gone");
    expect(classifyEntityError(api(401)).kind).toBe("unauthorized");
    expect(classifyEntityError(api(403)).kind).toBe("unauthorized");
    expect(classifyEntityError(api(429)).kind).toBe("rate-limited");
    expect(classifyEntityError(api(500)).kind).toBe("unavailable");
    expect(classifyEntityError(api(503)).kind).toBe("unavailable");
  });

  it("maps transport and contract failures", () => {
    expect(classifyEntityError(new NetworkError("down")).kind).toBe("unavailable");
    expect(classifyEntityError(new TimeoutError("slow", 10_000)).kind).toBe("unavailable");
    expect(classifyEntityError(new ValidationError("bad", [])).kind).toBe("malformed");
    expect(classifyEntityError(new MalformedApiResponseError("bad")).kind).toBe("malformed");
  });

  it("passes through unknown errors", () => {
    const status = classifyEntityError(new Error("other"));
    expect(status.kind).toBe("error");
  });
});

describe("isMissingEntity", () => {
  it("treats not-found and (prepared) gone as missing", () => {
    expect(isMissingEntity(classifyEntityError(api(404)))).toBe(true);
    expect(isMissingEntity(classifyEntityError(api(410)))).toBe(true);
    expect(isMissingEntity(classifyEntityError(api(500)))).toBe(false);
  });
});
