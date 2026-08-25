import type { DemoRecord } from "~/types";

const topics = ["制造业数字化转型观察", "秋季产品运营计划", "客户服务标准更新", "数据安全治理月报", "区域渠道增长复盘", "品牌内容发布规范", "智能仓储实践案例"];
const categories = ["行业观察", "产品动态", "客户案例", "运营指南", "公司新闻"];
const authors = ["陈思远", "林晓雨", "周文博", "赵清妍"];
const statuses = ["草稿", "待审核", "已发布", "已下线"];

export const articleCategories = categories.map((label) => ({ label, value: label }));

export const articles: DemoRecord[] = Array.from({ length: 28 }, (_, index) => ({
  id: `article-${(index + 1).toString().padStart(3, "0")}`,
  title: `${topics[index % topics.length]}${index > 6 ? `（第 ${Math.floor(index / 7) + 1} 期）` : ""}`,
  category: categories[index % categories.length]!,
  author: authors[index % authors.length]!,
  status: statuses[index % statuses.length]!,
  views: 328 + index * 157,
  updatedAt: `2026-08-${(24 - (index % 20)).toString().padStart(2, "0")} ${(9 + (index % 9)).toString().padStart(2, "0")}:30`,
  summary: "围绕当前业务重点整理的内容摘要，供运营和审核人员协作使用。",
  content: "<p>这是文章正文内容。数据仅用于本地演示。</p>",
  featured: index % 5 === 0,
}));
