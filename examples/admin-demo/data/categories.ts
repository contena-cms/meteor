export interface CategoryNode {
  id: string;
  name: string;
  code: string;
  count: number;
  status: "启用" | "停用";
  sort: number;
  children?: CategoryNode[];
}

export const categories: CategoryNode[] = [
  { id: "cat-1", name: "资讯中心", code: "news", count: 126, status: "启用", sort: 10, children: [
    { id: "cat-1-1", name: "公司新闻", code: "company", count: 46, status: "启用", sort: 10, children: [
      { id: "cat-1-1-1", name: "企业动态", code: "company-events", count: 18, status: "启用", sort: 10 },
      { id: "cat-1-1-2", name: "团队故事", code: "team-stories", count: 12, status: "启用", sort: 20 },
    ] },
    { id: "cat-1-2", name: "行业观察", code: "industry", count: 80, status: "启用", sort: 20, children: [
      { id: "cat-1-2-1", name: "政策解读", code: "policy", count: 25, status: "启用", sort: 10 },
      { id: "cat-1-2-2", name: "趋势报告", code: "trend", count: 31, status: "启用", sort: 20 },
    ] },
  ] },
  { id: "cat-2", name: "产品与服务", code: "product", count: 94, status: "启用", sort: 20, children: [
    { id: "cat-2-1", name: "产品动态", code: "release", count: 38, status: "启用", sort: 10, children: [
      { id: "cat-2-1-1", name: "版本发布", code: "versions", count: 19, status: "启用", sort: 10 },
      { id: "cat-2-1-2", name: "使用指南", code: "guides", count: 19, status: "启用", sort: 20 },
    ] },
    { id: "cat-2-2", name: "解决方案", code: "solutions", count: 56, status: "启用", sort: 20, children: [
      { id: "cat-2-2-1", name: "制造行业", code: "manufacturing", count: 22, status: "启用", sort: 10 },
      { id: "cat-2-2-2", name: "零售行业", code: "retail", count: 21, status: "停用", sort: 20 },
    ] },
  ] },
  { id: "cat-3", name: "客户成功", code: "success", count: 72, status: "启用", sort: 30, children: [
    { id: "cat-3-1", name: "客户案例", code: "cases", count: 44, status: "启用", sort: 10, children: [
      { id: "cat-3-1-1", name: "标杆案例", code: "featured-cases", count: 16, status: "启用", sort: 10 },
      { id: "cat-3-1-2", name: "区域案例", code: "regional-cases", count: 28, status: "启用", sort: 20 },
    ] },
    { id: "cat-3-2", name: "服务支持", code: "support", count: 28, status: "启用", sort: 20, children: [
      { id: "cat-3-2-1", name: "常见问题", code: "faq", count: 28, status: "启用", sort: 10 },
    ] },
  ] },
];
