<template>
  <EntityListPage title="操作日志" search-placeholder="搜索操作人、动作或对象" :items="records" :columns="columns" :searchable="['operator', 'action', 'object']" :filters="filters" date-key="time" readonly @open="openDetail" />
  <RecordDrawer :open="drawerOpen" kind="log" :record="current" @close="drawerOpen = false" @save="() => {}" />
</template>

<script setup lang="ts">
import { logs } from "~/data/logs";
import EntityListPage from "~/components/shared/EntityListPage.vue";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";
import type { DemoRecord } from "~/types";
const { records } = useDemoRepository("logs", logs);
const drawerOpen = ref(false); const current = ref<DemoRecord | null>(null);
const columns: any[] = [
  { label: "时间", property: "time", renderer: "text", position: 0, sortable: true, clickable: true, width: 160 },
  { label: "操作人", property: "operator", renderer: "text", position: 100, sortable: true, width: 110 },
  { label: "模块", property: "module", renderer: "text", position: 200, sortable: true, width: 120 },
  { label: "动作", property: "action", renderer: "text", position: 300, sortable: true, width: 90 },
  { label: "对象", property: "object", renderer: "text", position: 400, width: 180 },
  { label: "IP", property: "ip", renderer: "text", position: 500, width: 130 },
  { label: "结果", property: "result", renderer: "badge", position: 600, sortable: true, width: 90, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.result, variant: data.result === "成功" ? "positive" : "critical" }) } },
];
const filters = [
  { key: "module", label: "模块", options: ["文章管理", "用户管理", "订单管理", "系统设置"].map((label) => ({ label, value: label })) },
  { key: "result", label: "结果", options: ["成功", "失败"].map((label) => ({ label, value: label })) },
];
function openDetail(record: DemoRecord) { current.value = record; drawerOpen.value = true; }
</script>
