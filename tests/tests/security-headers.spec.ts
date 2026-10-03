// security-headers.spec.ts
import { test, expect } from "@playwright/test";

test("API response is missing basic security headers", async ({ request }) => {
  const res = await request.get("/api/articles");

  const headers = res.headers();

  // These should NOT be present — confirming the real,
  // unmodified gap in this backend (no helmet-equivalent middleware)
  expect(headers["x-content-type-options"]).toBeUndefined();
  expect(headers["strict-transport-security"]).toBeUndefined();
});
