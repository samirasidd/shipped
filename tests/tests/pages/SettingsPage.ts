// pages/SettingsPage.ts
import { Page, expect } from "@playwright/test";

export class SettingsPage {
  constructor(private page: Page) {}

  async updateBio(bio: string) {
    await this.page.getByRole("link", { name: "  Settings" }).click();
    await this.page
      .getByRole("textbox", { name: "Short bio about you" })
      .fill(bio);

    await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/api/user") && res.request().method() === "PUT",
      ),
      this.page.getByRole("button", { name: "Update Settings" }).click(),
    ]);
  }

  async assertBioPersisted(username: string, bio: string) {
    await this.page.goto(`/@${username}`);
    await expect(this.page.getByText(bio)).toBeVisible({ timeout: 15000 });
  }
}
