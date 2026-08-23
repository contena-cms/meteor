import { describe, expect, it } from "vitest";
import { enGB } from "date-fns/locale/en-GB";
import { zhCN } from "date-fns/locale/zh-CN";
import { importDateFnsLocaleModule, resolveDateFnsLocaleModule } from "./date-fns-locale";

describe("date-fns locale resolver", () => {
  it("imports valid locale paths", async () => {
    await expect(importDateFnsLocaleModule("zh-CN")).resolves.toBe(zhCN);
    await expect(importDateFnsLocaleModule("en-GB")).resolves.toBe(enGB);
  });

  it("resolves date-fns v4 named locale exports", () => {
    expect(resolveDateFnsLocaleModule("zh-CN", { zhCN })).toBe(zhCN);
    expect(resolveDateFnsLocaleModule("en-GB", { enGB })).toBe(enGB);
  });

  it("resolves nested default locale exports", () => {
    expect(resolveDateFnsLocaleModule("zh-CN", { default: { zhCN } })).toBe(zhCN);
  });

  it("resolves direct default locale exports", () => {
    expect(resolveDateFnsLocaleModule("zh-CN", { default: zhCN })).toBe(zhCN);
  });

  it("rejects unsafe locale import paths", async () => {
    await expect(importDateFnsLocaleModule("../format")).resolves.toBeNull();
    await expect(importDateFnsLocaleModule("en/US")).resolves.toBeNull();
  });
});
