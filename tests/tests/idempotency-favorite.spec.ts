// idempotency-favorite.spec.ts
import { test, expect } from "@playwright/test";

test("concurrent favorite requests do not double-count", async ({
  request,
}) => {
  const stamp = Date.now();
  let token: string;
  let slug: string;

  await test.step("register a user and create a fresh article", async () => {
    const userRes = await request.post("/api/users", {
      data: {
        user: {
          username: `user_${stamp}`,
          email: `user_${stamp}@test.com`,
          password: "12345678",
        },
      },
    });
    expect(userRes.status()).toBe(201);
    const { user } = await userRes.json();
    token = user.token;

    const articleRes = await request.post("/api/articles", {
      headers: { Authorization: `Token ${token}` },
      data: {
        article: {
          title: `Idempotency Test ${stamp}`,
          description: "desc",
          body: "body",
        },
      },
    });
    expect(articleRes.status()).toBe(201);
    const { article } = await articleRes.json();
    slug = article.slug;
  });

  await test.step("fire two favorite requests at the same time", async () => {
    const [res1, res2] = await Promise.all([
      request.post(`/api/articles/${slug}/favorite`, {
        headers: { Authorization: `Token ${token}` },
      }),
      request.post(`/api/articles/${slug}/favorite`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);

    // Check the final state, not either individual response —
    // what matters is where the count actually lands.
    const finalCheck = await request.get(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    const { article } = await finalCheck.json();

    console.log("Final favoritesCount:", article.favoritesCount);
    expect(article.favoritesCount).toBe(1);
  });
});
