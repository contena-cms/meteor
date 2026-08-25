import type { DemoRecord } from "~/types";

export const roles: DemoRecord[] = [
  ["超级管理员", 3, "全部模块", "启用"],
  ["内容管理员", 8, "内容管理", "启用"],
  ["审核员", 5, "内容审核", "启用"],
  ["运营专员", 12, "内容、业务中心", "启用"],
  ["客服", 9, "客户、订单", "启用"],
  ["只读访客", 4, "只读访问", "停用"],
].map(([name, members, scope, status], index) => ({
  id: `role-${index + 1}`,
  name: String(name),
  members: Number(members),
  scope: String(scope),
  updatedAt: `2026-08-${(20 - index).toString().padStart(2, "0")} 10:00`,
  status: String(status),
}));

export const permissionModules = ["工作台", "文章管理", "栏目管理", "订单管理", "客户管理", "用户管理", "角色权限", "系统管理"];
export const permissionActions = ["查看", "新增", "编辑", "删除", "审核", "导出"];
