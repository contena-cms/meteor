import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("用户名", { exact: true }).fill("admin");
  await page.getByLabel("密码", { exact: true }).fill("meteor");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe.serial("星云内容中台关键流程", () => {
  test("错误账号提示并使用测试账号登录", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("用户名", { exact: true }).fill("wrong");
    await page.getByLabel("密码", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: "登录" }).click();
    await expect(page.getByText("用户名或密码错误")).toBeVisible();
    await page.getByLabel("用户名", { exact: true }).fill("admin");
    await page.getByLabel("密码", { exact: true }).fill("meteor");
    await page.getByRole("button", { name: "登录" }).click();
    await expect(page.getByRole("heading", { name: "工作台" })).toBeVisible();
  });

  test("侧栏状态持久化并切换主题", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "收起侧栏" }).click();
    await expect(page.locator(".admin-shell")).toHaveClass(/admin-shell--collapsed/);
    await page.reload();
    await expect(page.locator(".admin-shell")).toHaveClass(/admin-shell--collapsed/);
    await page.locator(".admin-sidebar").hover();
    await page.getByRole("button", { name: "展开侧栏" }).click();
    await page.getByRole("button", { name: "切换主题" }).click();
    await page.getByText("暗色", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "切换主题" }).click();
    await page.getByText("亮色", { exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "查看消息" }).click();
    await expect(page.getByText("2 篇文章等待审核")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.locator(".user-trigger").click();
    await expect(page.getByText("个人资料", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /组织权限/ }).click();
    await page.getByRole("link", { name: "用户管理", exact: true }).click();
    await expect(page).toHaveURL(/organization\/users/);
    await expect(page.getByLabel("面包屑")).toContainText("组织权限用户管理");
  });

  test("用户筛选、排序、分页、批量停用与重新启用", async ({ page }) => {
    await login(page);
    await page.goto("/organization/users");
    await page.getByPlaceholder("搜索姓名、用户名或手机号").fill("yunfan01");
    await page.getByRole("button", { name: "搜索", exact: true }).click();
    await expect(page.getByText("共 1 条", { exact: true })).toBeVisible();
    await expect(page.getByText("yunfan01", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "重置", exact: true }).click();
    await expect(page.getByText("共 32 条", { exact: true })).toBeVisible();
    await page.locator("thead th").filter({ hasText: "用户名" }).click({ position: { x: 16, y: 20 } });
    const checkboxes = page.locator("tbody input[type=checkbox]");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await expect(page.getByText("已选择 2 条")).toBeVisible();
    await page.getByRole("button", { name: "批量处理" }).click();
    await expect(page.getByText("所选用户已停用，可再次批量编辑以启用")).toBeVisible();
    await page.getByRole("button", { name: "批量处理" }).click();
    await expect(page.getByText("所选用户已重新启用")).toBeVisible();
    await page.getByRole("button", { name: "下一页", exact: true }).click({ timeout: 5_000 });
    await expect(page.getByText("第 21-32 条，共 32 条", { exact: true })).toBeVisible();
  });

  test("新增、编辑和删除用户", async ({ page }) => {
    await login(page);
    await page.goto("/organization/users");
    await page.getByRole("button", { name: /新增用户/ }).click();
    await page.getByLabel("姓名").fill("测试用户");
    await page.getByLabel("用户名").fill("testuser");
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText("用户已创建")).toBeVisible();
    await page.getByPlaceholder("搜索姓名、用户名或手机号").fill("testuser");
    await page.getByRole("button", { name: "搜索", exact: true }).click();
    await expect(page.getByText("测试用户")).toBeVisible();
    await page.getByText("编辑", { exact: true }).last().click();
    await page.getByLabel("姓名").fill("测试用户已编辑");
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText("用户信息已更新")).toBeVisible();
    await page.locator("tbody button").first().click();
    await page.getByText("删除", { exact: true }).click();
    await page.getByRole("button", { name: "确认删除" }).click();
    await expect(page.getByText("记录已删除")).toBeVisible();
  });

  test("文章编辑和订单详情", async ({ page }) => {
    await login(page);
    await page.goto("/content/articles");
    await page.getByText("编辑", { exact: true }).first().click();
    const title = page.getByLabel("文章标题");
    await title.fill(`${await title.inputValue()}（已更新）`);
    await page.getByRole("button", { name: "保存草稿" }).click();
    await expect(page.getByText("文章已保存")).toBeVisible();
    await page.goto("/business/orders");
    await page.getByText("CT20260800001", { exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("¥680.00");
    await expect(page.getByRole("dialog")).toContainText("待支付");
    await page.getByRole("button", { name: "关闭抽屉" }).click();
    await page.locator("tbody button").first().click();
    await page.getByText("编辑", { exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("编辑订单");
  });

  test("视觉截图与移动端菜单、抽屉", async ({ page }) => {
    await mkdir("test-results/visual", { recursive: true });
    await login(page);
    await page.screenshot({ path: "test-results/visual/dashboard-1440.png", fullPage: false });
    await page.goto("/organization/users");
    await page.screenshot({ path: "test-results/visual/users-1440.png", fullPage: false });
    await page.getByText("编辑", { exact: true }).first().click();
    await page.screenshot({ path: "test-results/visual/user-drawer-1440.png", fullPage: false });
    await page.goto("/system/settings");
    await page.screenshot({ path: "test-results/visual/settings-1440.png", fullPage: false });

    await page.goto("/business/orders");
    await page.screenshot({ path: "test-results/visual/orders-default-1440.png", fullPage: false });
    await page.locator("tbody input[type=checkbox]").nth(0).check();
    await page.locator("tbody input[type=checkbox]").nth(1).check();
    await page.screenshot({ path: "test-results/visual/orders-selected-1440.png", fullPage: false });
    await page.reload();
    await page.getByRole("button", { name: "列设置" }).click();
    await page.getByText("列", { exact: true }).click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: "test-results/visual/orders-columns-1440.png", fullPage: false });
    await page.keyboard.press("Escape");
    await page.getByText("CT20260800001", { exact: true }).click();
    await page.screenshot({ path: "test-results/visual/orders-detail-1440.png", fullPage: false });
    await page.getByRole("button", { name: "关闭抽屉" }).click();
    await page.screenshot({ path: "test-results/visual/shell-expanded-1440.png", fullPage: false });
    await page.getByRole("button", { name: "收起侧栏" }).click();
    await page.screenshot({ path: "test-results/visual/shell-collapsed-1440.png", fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => {
      localStorage.removeItem("admin-demo-auth");
      sessionStorage.removeItem("admin-demo-auth");
    });
    await page.goto("/login");
    await page.screenshot({ path: "test-results/visual/login-390.png", fullPage: false });
    await login(page);
    await page.getByRole("button", { name: "打开菜单" }).click();
    await expect(page.locator(".admin-sidebar--mobile-open")).toBeVisible();
    await expect(page.locator(".admin-sidebar--mobile-open .brand-copy")).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({ path: "test-results/visual/mobile-menu-390.png", fullPage: false });
    await page.mouse.click(350, 700);
    await page.goto("/business/orders");
    await expect(page.getByRole("heading", { name: "订单管理" })).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({ path: "test-results/visual/orders-mobile-390.png", fullPage: false });
    await page.goto("/organization/users");
    await page.getByRole("button", { name: /新增用户/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: "test-results/visual/user-drawer-390.png", fullPage: false });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
