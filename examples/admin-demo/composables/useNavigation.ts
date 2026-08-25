import type { NavigationGroup } from "~/types";

export const navigationGroups: NavigationGroup[] = [
  { label: "工作台", icon: "regular-home", isPrimary: true, children: [{ label: "工作台", path: "/dashboard" }] },
  { label: "内容管理", icon: "regular-file-edit", children: [
    { label: "文章管理", path: "/content/articles" },
    { label: "栏目管理", path: "/content/categories" },
  ] },
  { label: "业务中心", icon: "regular-briefcase", children: [
    { label: "订单管理", path: "/business/orders" },
    { label: "客户管理", path: "/business/customers" },
  ] },
  { label: "组织权限", icon: "regular-users", children: [
    { label: "用户管理", path: "/organization/users" },
    { label: "角色权限", path: "/organization/roles" },
  ] },
  { label: "系统管理", icon: "regular-cog", children: [
    { label: "系统设置", path: "/system/settings" },
    { label: "操作日志", path: "/system/logs" },
  ] },
];

export function useNavigation() {
  const route = useRoute();
  const current = computed(() => navigationGroups.flatMap((group) => group.children).find((item) => item.path === route.path));
  const currentGroup = computed(() => navigationGroups.find((group) => group.children.some((item) => item.path === route.path)));
  return { groups: navigationGroups, current, currentGroup };
}
