import type { DemoRecord } from "~/types";

const operators = ["陈思远", "林晓雨", "周文博", "赵清妍"];
const modules = ["文章管理", "用户管理", "订单管理", "系统设置"];
const actions = ["新增", "编辑", "删除", "导出", "登录"];

export const logs: DemoRecord[] = Array.from({ length: 48 }, (_, index) => ({
  id: `log-${(index + 1).toString().padStart(3, "0")}`,
  time: `2026-08-${(24 - (index % 20)).toString().padStart(2, "0")} ${(18 - (index % 10)).toString().padStart(2, "0")}:${(index % 6) * 10}`,
  operator: operators[index % operators.length]!,
  module: modules[index % modules.length]!,
  action: actions[index % actions.length]!,
  object: index % 2 === 0 ? `记录 #${1000 + index}` : `配置项 ${index + 1}`,
  ip: `192.168.10.${20 + (index % 80)}`,
  result: index % 11 === 0 ? "失败" : "成功",
  summary: `对${modules[index % modules.length]}执行${actions[index % actions.length]}操作`,
  before: index % 3 === 0 ? "状态：停用" : "字段保持不变",
  after: index % 3 === 0 ? "状态：启用" : "更新业务字段",
}));
