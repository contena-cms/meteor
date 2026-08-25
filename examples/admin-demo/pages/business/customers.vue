<template>
  <EntityListPage title="客户管理" add-label="新增客户" search-placeholder="搜索姓名或手机号" :items="records" :columns="columns" :searchable="['name', 'phone']" :filters="filters" @add="openCreate" @open="openEdit" @delete="remove" @bulk-edit="bulkActivate" />
  <RecordDrawer :open="drawerOpen" kind="customer" :record="current" :creating="creating" @close="drawerOpen = false" @save="save" />
</template>

<script setup lang="ts">
import { useSnackbar } from "@contena/meteor-component-library";
import EntityListPage from "~/components/shared/EntityListPage.vue";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";
import { customers } from "~/data/customers";
import type { DemoRecord } from "~/types";
const { records, add, update, remove, bulkUpdate } = useDemoRepository("customers", customers);
const { addSnackbar } = useSnackbar();
const drawerOpen = ref(false); const creating = ref(false); const current = ref<DemoRecord | null>(null);
const columns: any[] = [
  { label: "姓名", property: "name", renderer: "text", position: 0, sortable: true, clickable: true, width: 110 },
  { label: "手机号", property: "phone", renderer: "text", position: 100, width: 130 },
  { label: "等级", property: "level", renderer: "badge", position: 200, sortable: true, width: 120, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.level, variant: data.level === "战略客户" ? "info" : "neutral" }) } },
  { label: "来源", property: "source", renderer: "text", position: 300, sortable: true, width: 120 },
  { label: "订单数", property: "orderCount", renderer: "number", position: 400, sortable: true, width: 90 },
  { label: "累计消费", property: "spentText", renderer: "text", position: 500, sortable: true, width: 130 },
  { label: "最近活跃", property: "lastActive", renderer: "text", position: 600, sortable: true, width: 160 },
  { label: "状态", property: "status", renderer: "badge", position: 700, sortable: true, width: 90, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.status, variant: data.status === "活跃" ? "positive" : "attention" }) } },
];
const filters = [
  { key: "level", label: "等级", options: ["普通客户", "银牌客户", "金牌客户", "战略客户"].map((label) => ({ label, value: label })) },
  { key: "source", label: "来源", options: ["官网注册", "销售录入", "活动线索", "渠道推荐"].map((label) => ({ label, value: label })) },
  { key: "status", label: "状态", options: ["活跃", "流失"].map((label) => ({ label, value: label })) },
];
function openCreate() { creating.value = true; current.value = null; drawerOpen.value = true; }
function openEdit(record: DemoRecord) { creating.value = false; current.value = record; drawerOpen.value = true; }
function save(record: DemoRecord) { creating.value ? add(record) : update(record.id, record); drawerOpen.value = false; addSnackbar({ message: "客户资料已保存", variant: "success" }); }
function bulkActivate(ids: string[]) { bulkUpdate(ids, { status: "活跃" }); addSnackbar({ message: `已激活 ${ids.length} 位客户`, variant: "success" }); }
</script>
