<template>
  <div class="page-stack dashboard">
    <div class="page-title-row"><div><h1>工作台</h1><p>2026 年 8 月 25 日，欢迎回来，管理员。</p></div><div class="quick-actions"><MtButton variant="secondary" @click="go('/content/articles')"><MtIcon name="regular-plus-s" />新建文章</MtButton><MtButton variant="secondary" @click="go('/organization/users')">新增用户</MtButton><MtButton variant="secondary" @click="go('/system/logs')">查看日志</MtButton></div></div>
    <section class="metrics" aria-label="今日指标">
      <MtCard v-for="metric in metrics" :key="metric.label"><span class="metric-label">{{ metric.label }}</span><strong>{{ metric.value }}</strong><span :class="['metric-change', metric.tone]">{{ metric.change }}</span></MtCard>
    </section>
    <section class="dashboard-grid">
      <MtCard title="近 14 天业务趋势" subtitle="成交额与订单量"><MtChart :series="chartSeries" :options="chartOptions" type="area" height="280" /></MtCard>
      <MtCard title="待办事项"><div class="todo-list"><div v-for="todo in todos" :key="todo.label"><span><MtStatusDot :variant="todo.variant" />{{ todo.label }}</span><strong>{{ todo.count }}</strong></div></div></MtCard>
    </section>
    <MtCard title="最近订单" subtitle="最新 6 笔业务订单">
      <MtDataTable :data-source="recentOrders" :columns="orderColumns" :current-page="1" :pagination-limit="10" :pagination-total-items="6" :disable-search="true" :disable-edit="true" :disable-delete="true" :disable-settings-table="false" caption="最近订单" />
    </MtCard>
  </div>
</template>

<script setup lang="ts">
import { MtButton, MtCard, MtChart, MtDataTable, MtIcon, MtStatusDot } from "@contena/meteor-component-library";
import { orders } from "~/data/orders";
import type { DemoRecord } from "~/types";
const metrics = [
  { label: "今日订单", value: "186", change: "环比增长 12.4%", tone: "positive" },
  { label: "今日成交额", value: "¥328,640", change: "环比增长 8.7%", tone: "positive" },
  { label: "待审核文章", value: "12", change: "较昨日减少 3 篇", tone: "attention" },
  { label: "活跃用户", value: "1,284", change: "在线率 68.2%", tone: "info" },
];
const todos = [
  { label: "内容审核", count: 12, variant: "attention" as const }, { label: "库存预警", count: 7, variant: "critical" as const },
  { label: "待处理退款", count: 4, variant: "info" as const }, { label: "账号安全", count: 2, variant: "positive" as const },
];
const categories = Array.from({ length: 14 }, (_, index) => `${index + 12}日`);
const chartSeries = [{ name: "成交额（千元）", data: [18, 22, 20, 27, 31, 29, 38, 35, 42, 46, 41, 52, 49, 58] }, { name: "订单量", data: [62, 74, 69, 88, 96, 91, 112, 106, 128, 137, 125, 154, 148, 176] }];
const chartOptions = { xaxis: { categories }, stroke: { curve: "smooth" }, legend: { position: "top" }, dataLabels: { enabled: false } } as any;
const recentOrders = orders.slice(0, 6);
function go(path: string) { void navigateTo(path); }
const orderColumns: any[] = [
  { label: "订单号", property: "orderNo", renderer: "text", position: 0, width: 180 }, { label: "客户", property: "customer", renderer: "text", position: 100, width: 180 },
  { label: "金额", property: "amountText", renderer: "text", position: 200, width: 130 },
  { label: "状态", property: "fulfillmentStatus", renderer: "badge", position: 300, width: 110, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.fulfillmentStatus, variant: data.fulfillmentStatus === "已完成" ? "positive" : "info" }) } },
  { label: "时间", property: "createdAt", renderer: "text", position: 400, width: 170 },
];
</script>

<style scoped lang="scss">
.page-title-row p { margin: var(--scale-size-4) 0 0; color: var(--color-text-secondary-default); }
.quick-actions { display: flex; gap: var(--scale-size-8); }
.metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--scale-size-12); }
.metrics :deep(.mt-card), .dashboard-grid :deep(.mt-card), .dashboard > :deep(.mt-card) { width: 100%; }
.metrics :deep(.mt-card__content) { display: grid; gap: var(--scale-size-8); padding: var(--scale-size-16); }
.metric-label { color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }
.metrics strong { font-size: var(--font-size-2xl); line-height: 1.15; }
.metric-change { font-size: var(--font-size-2xs); }.metric-change.positive { color: var(--color-text-positive-default); }.metric-change.attention { color: var(--color-text-attention-default); }.metric-change.info { color: var(--color-text-brand-default); }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: var(--scale-size-16); }
.todo-list { display: grid; }.todo-list > div { min-height: 52px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border-secondary-default); }.todo-list span { display: flex; align-items: center; gap: var(--scale-size-8); }
@media (max-width: 1100px) { .metrics { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) { .page-title-row { display: grid; } .quick-actions { overflow-x: auto; } .metrics { grid-template-columns: 1fr; } }
</style>
