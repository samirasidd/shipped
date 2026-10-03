// pages/AuthPage.ts
import { Page, expect } from "@playwright/test";

export class AuthPage {
  constructor(private page: Page) {}

  async signUp(username: string, email: string, password: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Sign up" }).click();
    await this.page.getByRole("textbox", { name: "Username" }).fill(username);
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign up" }).click();
    await expect(this.page.getByRole("link", { name: username })).toBeVisible({
      timeout: 15000,
    });
  }
}
