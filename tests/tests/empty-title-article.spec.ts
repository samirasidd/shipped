// empty-title-article.spec.ts
import { test, expect } from "@playwright/test";

test("article creation with empty title is rejected server-side", async ({
  request,
}) => {
  const stamp = Date.now();
  let token: string;

  await test.step("register a user to get an auth token", async () => {
    const res = await request.post("/api/users", {
      data: {
        user: {
          username: `user_${stamp}`,
          email: `user_${stamp}@test.com`,
          password: "12345678",
        },
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    token = body.user.token;
  });

  await test.step("attempt to create an article with an empty title", async () => {
    const res = await request.post("/api/articles", {
      headers: { Authorization: `Token ${token}` },
      data: {
        article: {
          title: "",
          description: "About section",
          body: "Paragraphs",
        },
      },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.errors.title).toContain("can't be blank");
  });
});
