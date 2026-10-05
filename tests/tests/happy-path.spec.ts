import { test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { ArticlePage } from "./pages/ArticlePage";
import { SettingsPage } from "./pages/SettingsPage";

test("core happy path: register, create article, edit profile", async ({
  page,
}) => {
  const stamp = Date.now();
  const auth = new AuthPage(page);
  const article = new ArticlePage(page);
  const settings = new SettingsPage(page);
  const username = `sam_${stamp}`;

  await test.step("register a new user", async () => {
    await auth.signUp(`sam_${stamp}`, `sam_${stamp}@test.com`, "12345678");
  });

  await test.step("create an article", async () => {
    await article.create(
      `Test Article ${stamp}`,
      "About section",
      "Paragraphs",
    );
  });

  await test.step("article appears on global feed", async () => {
   // await article.assertVisibleOnFeed(`Test Article ${stamp}`);
await article.assertVisibleOnFeed(`This Article Does Not Exist ${stamp}`);
  });

  await test.step("update and persist bio", async () => {
    await settings.updateBio(`Bio updated ${stamp}`);
    await settings.assertBioPersisted(username, `Bio updated ${stamp}`);
  });
});
