// unauthenticated-favorite.spec.ts
import { test, expect } from "@playwright/test";

test("favoriting an article without authentication is rejected", async ({
  request,
}) => {
  const stamp = Date.now();
  let slug: string;

  await test.step("register a user and create an article", async () => {
    const registerRes = await request.post("/api/users", {
      data: {
        user: {
          username: `user_${stamp}`,
          email: `user_${stamp}@test.com`,
          password: "12345678",
        },
      },
    });
    expect(registerRes.status()).toBe(201);
    const { user } = await registerRes.json();

    const articleRes = await request.post("/api/articles", {
      headers: { Authorization: `Token ${user.token}` },
      data: {
        article: {
          title: `Favorite Test Article ${stamp}`,
          description: "desc",
          body: "body text",
        },
      },
    });
    expect(articleRes.status()).toBe(201);
    const { article } = await articleRes.json();
    slug = article.slug;
  });

  await test.step("attempt to favorite with no auth header", async () => {
    const res = await request.post(`/api/articles/${slug}/favorite`);
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("missing authorization credentials");
  });
});
