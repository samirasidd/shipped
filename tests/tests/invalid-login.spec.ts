// invalid-login.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("invalid login shows correct error", async ({ page }) => {
  const login = new LoginPage(page);

  await test.step("attempt login with invalid credentials", async () => {
    await login.attemptLogin(
      "nobody-doesnotexist@test.com",
      "wrongpassword123",
    );
  });

  await test.step("error message is shown", async () => {
    await login.assertInvalidCredentialsError();
  });
});
