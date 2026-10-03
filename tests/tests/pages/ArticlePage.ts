// pages/ArticlePage.ts
import { Page, expect } from "@playwright/test";

export class ArticlePage {
  constructor(private page: Page) {}

  async create(title: string, about: string, body: string) {
    await this.page.getByRole("link", { name: "  New Post" }).click();
    await this.page.getByRole("textbox", { name: "Article Title" }).fill(title);
    await this.page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill(about);
    await this.page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill(body);
    await this.page.getByRole("button", { name: "Publish Article" }).click();
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible({
      timeout: 15000,
    });
  }

  async assertVisibleOnFeed(title: string) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Global Feed" }).click();
    await expect(this.page.getByRole("link", { name: title })).toBeVisible({
      timeout: 15000,
    });
  }
}
