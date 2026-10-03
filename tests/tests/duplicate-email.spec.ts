// duplicate-email.spec.ts
import { test, expect } from "@playwright/test";

test("duplicate email registration is rejected", async ({ request }) => {
  const stamp = Date.now();
  const email = `dupe_${stamp}@test.com`;

  await test.step("register the first user", async () => {
    const res = await request.post("/api/users", {
      data: {
        user: {
          username: `user_a_${stamp}`,
          email: email,
          password: "12345678",
        },
      },
    });
    expect(res.status()).toBe(201);
  });

  await test.step("attempt to register a second user with the same email", async () => {
    const res = await request.post("/api/users", {
      data: {
        user: {
          username: `user_b_${stamp}`, // different username, same email
          email: email,
          password: "12345678",
        },
      },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.errors.email).toContain("has already been taken");
  });
});
