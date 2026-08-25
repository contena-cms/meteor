import type { DemoRecord } from "~/types";

const names = ["陈思远", "林晓雨", "周文博", "赵清妍", "吴嘉诚", "孙雅宁", "徐子涵", "何俊杰"];
const departments = ["内容运营部", "技术研发部", "客户服务部", "市场增长部"];
const roles = ["内容管理员", "审核员", "运营专员", "客服"];

export const userOptions = {
  departments: departments.map((label) => ({ label, value: label })),
  roles: roles.map((label) => ({ label, value: label })),
};

export const users: DemoRecord[] = Array.from({ length: 32 }, (_, index) => {
  const number = index + 1;
  return {
    id: `user-${number.toString().padStart(3, "0")}`,
    name: names[index % names.length]!,
    username: `yunfan${number.toString().padStart(2, "0")}`,
    email: `yunfan${number}@example.cn`,
    phone: `138****${(6200 + number).toString().slice(-4)}`,
    department: departments[index % departments.length]!,
    role: roles[index % roles.length]!,
    gender: index % 3 === 0 ? "女" : "男",
    status: index % 7 === 0 ? "停用" : "启用",
    lastLogin: `2026-08-${(24 - (index % 18)).toString().padStart(2, "0")} ${(18 - (index % 9)).toString().padStart(2, "0")}:20`,
    note: number % 4 === 0 ? "负责重点业务线日常维护" : "",
  };
});
