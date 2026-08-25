<template>
  <EntityListPage title="文章管理" add-label="新建文章" search-placeholder="搜索标题或作者" :items="records" :columns="columns" :searchable="['title', 'author']" :filters="filters" date-key="updatedAt" @add="openCreate" @open="openEdit" @delete="remove" @bulk-edit="bulkOffline" />
  <RecordDrawer :open="drawerOpen" kind="article" :record="current" :creating="creating" @close="drawerOpen = false" @save="save" />
</template>

<script setup lang="ts">
import { useSnackbar } from "@contena/meteor-component-library";
import EntityListPage from "~/components/shared/EntityListPage.vue";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";
import { articleCategories, articles } from "~/data/articles";
import type { DemoRecord } from "~/types";
const { records, add, update, remove, bulkUpdate } = useDemoRepository("articles", articles);
const { addSnackbar } = useSnackbar();
const drawerOpen = ref(false); const creating = ref(false); const current = ref<DemoRecord | null>(null);
const statusVariant: Record<string, string> = { 草稿: "neutral", 待审核: "attention", 已发布: "positive", 已下线: "critical" };
const columns: any[] = [
  { label: "标题", property: "title", renderer: "text", position: 0, sortable: true, clickable: true, width: 320, cellWrap: "nowrap" },
  { label: "栏目", property: "category", renderer: "text", position: 100, sortable: true, width: 130 },
  { label: "作者", property: "author", renderer: "text", position: 200, sortable: true, width: 110 },
  { label: "状态", property: "status", renderer: "badge", position: 300, sortable: true, width: 110, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.status, variant: statusVariant[String(data.status)] }) } },
  { label: "浏览量", property: "views", renderer: "number", position: 400, sortable: true, width: 100 },
  { label: "更新时间", property: "updatedAt", renderer: "text", position: 500, sortable: true, width: 160 },
];
const filters = [
  { key: "category", label: "栏目", options: articleCategories },
  { key: "status", label: "状态", options: ["草稿", "待审核", "已发布", "已下线"].map((label) => ({ label, value: label })) },
];
function openCreate() { creating.value = true; current.value = null; drawerOpen.value = true; }
function openEdit(record: DemoRecord) { creating.value = false; current.value = record; drawerOpen.value = true; }
function save(record: DemoRecord) { creating.value ? add(record) : update(record.id, record); drawerOpen.value = false; addSnackbar({ message: creating.value ? "文章已创建" : "文章已保存", variant: "success" }); }
function bulkOffline(ids: string[]) { bulkUpdate(ids, { status: "已下线" }); addSnackbar({ message: `已将 ${ids.length} 篇文章设为下线`, variant: "success" }); }
</script>
