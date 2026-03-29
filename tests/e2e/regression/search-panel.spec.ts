import { expect, test } from "@playwright/test";
import { ROUTES } from "../support/routes";

test("@regression 搜索面板支持按钮关闭并恢复页面滚动", async ({ page }) => {
  await page.goto(ROUTES.home);

  const initialOverflow = await page.evaluate(() => {
    return document.body.style.overflow;
  });

  await page.getByRole("button", { name: "Search" }).click();

  const searchDialog = page.getByRole("dialog", { name: "Search" });
  await expect(searchDialog).toBeVisible();

  const searchInput = page.locator(".pagefind-ui__search-input");
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeFocused();

  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return document.body.style.overflow;
      });
    })
    .toBe("hidden");

  await page.getByRole("button", { name: "Close search", exact: true }).click();
  await expect(searchDialog).not.toBeVisible();

  await expect
    .poll(async () => {
      return page.evaluate(() => {
        return document.body.style.overflow;
      });
    })
    .toBe(initialOverflow);
});

test("@regression 输入框聚焦时 Ctrl/Cmd+K 不应触发搜索面板", async ({ page }) => {
  await page.goto(ROUTES.home);

  const searchDialog = page.getByRole("dialog", { name: "Search" });
  const openSearchButton = page.getByRole("button", { name: "Search" });
  const closeSearchButton = page.getByRole("button", {
    name: "Close search",
    exact: true,
  });
  const shortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";

  await openSearchButton.click();
  await expect(searchDialog).toBeVisible();
  await closeSearchButton.click();
  await expect(searchDialog).not.toBeVisible();

  await page.keyboard.press(shortcut);
  await expect(searchDialog).toBeVisible();
  await closeSearchButton.click();
  await expect(searchDialog).not.toBeVisible();

  const editableInput = page.getByLabel("E2E editable input");

  await page.evaluate(() => {
    const existing = document.getElementById("e2e-editable-input");
    if (existing instanceof HTMLInputElement) {
      existing.focus();
      return;
    }

    const input = document.createElement("input");
    input.id = "e2e-editable-input";
    input.setAttribute("aria-label", "E2E editable input");
    document.body.appendChild(input);
    input.focus();
  });

  await expect(editableInput).toBeFocused();

  await page.keyboard.press(shortcut);
  await expect(searchDialog).not.toBeVisible();
});
