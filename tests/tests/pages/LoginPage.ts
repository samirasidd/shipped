// pages/LoginPage.ts
import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async attemptLogin(email: string, password: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Sign in" }).click();
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }

  async assertInvalidCredentialsError() {
    await expect(
      this.page.getByText("email or password is invalid"),
    ).toBeVisible();
  }
}
