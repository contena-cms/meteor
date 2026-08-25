import { describe, expect, it } from "vitest";
import { queryRecords } from "~/composables/useDemoRepository";
import { articles } from "~/data/articles";
import { customers } from "~/data/customers";
import { logs } from "~/data/logs";
import { orders } from "~/data/orders";
import { roles } from "~/data/roles";
import { users } from "~/data/users";
import type { QueryState } from "~/types";

const baseQuery: QueryState = { search: "", filters: {}, sortBy: "id", sortDirection: "ASC", page: 1, limit: 20 };

describe("demo fixtures", () => {
  it("meets the acceptance data volumes with stable ids", () => {
    expect(articles).toHaveLength(28);
    expect(orders).toHaveLength(36);
    expect(customers).toHaveLength(24);
    expect(users).toHaveLength(32);
    expect(roles).toHaveLength(6);
    expect(logs).toHaveLength(48);
    expect(new Set([...articles, ...orders, ...customers, ...users, ...logs].map((item) => item.id)).size).toBe(168);
  });
});

describe("queryRecords", () => {
  it("searches across configured business fields", () => {
    const result = queryRecords(users, { ...baseQuery, search: "yunfan01" }, ["name", "username", "phone"]);
    expect(result.total).toBe(1);
    expect(result.items[0]?.username).toBe("yunfan01");
  });

  it("combines filters and descending sorting", () => {
    const result = queryRecords(users, { ...baseQuery, filters: { status: "停用" }, sortBy: "username", sortDirection: "DESC" }, ["name"]);
    expect(result.items.every((item) => item.status === "停用")).toBe(true);
    expect(String(result.items[0]?.username) > String(result.items.at(-1)?.username)).toBe(true);
  });

  it("paginates without changing the source array", () => {
    const source = structuredClone(orders);
    const result = queryRecords(orders, { ...baseQuery, sortBy: "amount", page: 2, limit: 10 }, ["orderNo"]);
    expect(result.total).toBe(36);
    expect(result.items).toHaveLength(10);
    expect(orders).toEqual(source);
  });
});
