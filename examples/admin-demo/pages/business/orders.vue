<template>
  <EntityListPage
    title="订单管理"
    add-label="新增订单"
    search-placeholder="搜索订单号或客户名称"
    :items="records"
    :columns="columns"
    :searchable="['orderNo', 'customer']"
    :filters="filters"
    date-key="createdAt"
    separate-view
    menu-only
    primary-action="view"
    @add="openCreate"
    @open="openEdit"
    @view="openView"
    @delete="remove"
    @bulk-edit="bulkProcess"
  />
  <RecordDrawer
    :open="drawerOpen"
    kind="order"
    :mode="drawerMode"
    :record="current"
    :creating="drawerMode === 'create'"
    @close="drawerOpen = false"
    @save="save"
  />
</template>

<script setup lang="ts">
import { useSnackbar } from "@contena/meteor-component-library";
import { orders } from "~/data/orders";
import EntityListPage from "~/components/shared/EntityListPage.vue";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";
import type { DemoRecord } from "~/types";
const { records, add, update, remove, bulkUpdate } = useDemoRepository("orders", orders);
const { addSnackbar } = useSnackbar();
const drawerOpen = ref(false);
const current = ref<DemoRecord | null>(null);
const drawerMode = ref<"create" | "edit" | "view">("view");
const columns: any[] = [
  { label: "订单号", property: "orderNo", renderer: "text", position: 0, sortable: true, clickable: true, width: 190 },
  { label: "客户", property: "customer", renderer: "text", position: 100, sortable: true, width: 190 },
  { label: "渠道", property: "channel", renderer: "text", position: 200, sortable: true, width: 110, visible: false },
  { label: "商品数", property: "itemCount", renderer: "number", position: 300, sortable: true, width: 90, visible: false },
  { label: "应付金额", property: "amountText", renderer: "text", position: 400, sortable: true, width: 120 },
  { label: "支付状态", property: "paymentStatus", renderer: "text", position: 500, sortable: true, width: 104 },
  { label: "履约状态", property: "fulfillmentStatus", renderer: "text", position: 600, sortable: true, width: 110 },
  { label: "下单时间", property: "createdAt", renderer: "text", position: 700, sortable: true, width: 160 },
];
const filters = [
  { key: "paymentStatus", label: "支付状态", options: ["待支付", "已支付", "已退款"].map((label) => ({ label, value: label })) },
  { key: "fulfillmentStatus", label: "履约状态", options: ["待处理", "处理中", "已完成", "已关闭"].map((label) => ({ label, value: label })) },
];
function openCreate() { drawerMode.value = "create"; current.value = null; drawerOpen.value = true; }
function openEdit(record: DemoRecord) { drawerMode.value = "edit"; current.value = record; drawerOpen.value = true; }
function openView(record: DemoRecord) { drawerMode.value = "view"; current.value = record; drawerOpen.value = true; }
function save(record: DemoRecord) {
  const normalized = {
    ...record,
    amount: Number(record.amount ?? 0),
    amountText: new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(Number(record.amount ?? 0)),
  };
  drawerMode.value === "create" ? add(normalized) : update(normalized.id, normalized);
  drawerOpen.value = false;
  addSnackbar({ message: drawerMode.value === "create" ? "订单已创建" : "订单已更新", variant: "success" });
}
function bulkProcess(ids: string[]) {
  bulkUpdate(ids, { fulfillmentStatus: "处理中" });
  addSnackbar({ message: `已将 ${ids.length} 条订单标记为处理中`, variant: "success" });
}
</script>
