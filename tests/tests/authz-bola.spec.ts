// authz-bola.spec.ts
import { test, expect } from "@playwright/test";

test("a user cannot edit another user's article", async ({ request }) => {
  const stamp = Date.now();
  let userBToken: string;
  let slug: string;

  await test.step("User A registers and creates an article", async () => {
    const res = await request.post("/api/users", {
      data: {
        user: {
          username: `user_a_${stamp}`,
          email: `user_a_${stamp}@test.com`,
          password: "12345678",
        },
      },
    });
    expect(res.status()).toBe(201);
    const { user } = await res.json();

    const articleRes = await request.post("/api/articles", {
      headers: { Authorization: `Token ${user.token}` },
      data: {
        article: {
          title: `User A's Article ${stamp}`,
          description: "desc",
          body: "original body",
        },
      },
    });
    expect(articleRes.status()).toBe(201);
    const { article } = await articleRes.json();
    slug = article.slug;
  });

  await test.step("User B registers separately", async () => {
    const res = await request.post("/api/users", {
      data: {
        user: {
          username: `user_b_${stamp}`,
          email: `user_b_${stamp}@test.com`,
          password: "12345678",
        },
      },
    });
    expect(res.status()).toBe(201);
    const { user } = await res.json();
    userBToken = user.token;
  });

  await test.step("User B attempts to edit User A's article", async () => {
    const res = await request.put(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${userBToken}` },
      data: {
        article: { title: "Hijacked Title" },
      },
    });

    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.message).toBe("You are not authorized to update this article");
  });
});
