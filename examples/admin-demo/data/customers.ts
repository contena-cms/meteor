import type { DemoRecord } from "~/types";

const names = ["王海峰", "许静怡", "郑云开", "蒋佩珊", "邵明哲", "方佳宁"];
const levels = ["普通客户", "银牌客户", "金牌客户", "战略客户"];
const sources = ["官网注册", "销售录入", "活动线索", "渠道推荐"];

export const customers: DemoRecord[] = Array.from({ length: 24 }, (_, index) => {
  const spent = 2600 + index * 1830;
  return {
    id: `customer-${(index + 1).toString().padStart(3, "0")}`,
    name: names[index % names.length]!,
    phone: `139****${(7100 + index).toString().slice(-4)}`,
    level: levels[index % levels.length]!,
    source: sources[index % sources.length]!,
    orderCount: 2 + (index % 17),
    spent,
    spentText: new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(spent),
    lastActive: `2026-08-${(24 - (index % 18)).toString().padStart(2, "0")} 14:20`,
    status: index % 9 === 0 ? "流失" : "活跃",
    tags: index % 2 === 0 ? ["重点跟进", "高复购"] : ["内容订阅"],
  };
});
