<template>
  <div class="page-stack enterprise-list-page">
    <div class="page-title-row">
      <div class="page-title-meta">
        <h1>{{ title }}</h1>
        <span class="page-count">共 {{ result.total }} 条</span>
      </div>
      <div class="page-title-actions">
        <MtButton v-if="!readonly" variant="primary" @click="emit('add')">
          <MtIcon name="regular-plus-s" />{{ addLabel }}
        </MtButton>
        <MtDropdownMenuRoot>
          <MtDropdownMenuTrigger as-child>
            <MtButton variant="tertiary">
              <MtIcon name="regular-ellipsis-h-s" />更多
            </MtButton>
          </MtDropdownMenuTrigger>
          <MtDropdownMenuPortal>
            <MtActionMenu>
              <MtActionMenuGroup>
                <MtActionMenuItem icon="regular-file-export" @select="exportRecords">导出当前结果</MtActionMenuItem>
                <MtActionMenuItem icon="regular-undo-s" @select="reload">刷新数据</MtActionMenuItem>
                <MtActionMenuItem icon="regular-filter" @select="resetFilters">清空筛选</MtActionMenuItem>
              </MtActionMenuGroup>
            </MtActionMenu>
          </MtDropdownMenuPortal>
        </MtDropdownMenuRoot>
      </div>
    </div>

    <form class="filter-toolbar" aria-label="列表筛选" @submit.prevent="applyFilters">
      <MtSearch v-model="searchDraft" class="filter-toolbar__search" :placeholder="searchPlaceholder" />
      <MtSelect
        v-for="filter in filters"
        :key="filter.key"
        v-model="filterDraft[filter.key]"
        class="filter-toolbar__select"
        :label="filter.label"
        :options="[{ label: '全部', value: '' }, ...filter.options]"
        hide-clearable-button
      />
      <MtDatepicker
        v-if="dateKey"
        v-model="dateDraft"
        class="filter-toolbar__date"
        label="日期范围"
        date-type="date"
        range
      />
      <div class="filter-toolbar__actions">
        <MtButton type="submit" variant="primary">搜索</MtButton>
        <MtButton variant="secondary" @click="resetFilters">重置</MtButton>
      </div>
    </form>

    <section ref="workspace" class="table-workspace" :class="`table-workspace--${density}`" aria-label="数据列表">
      <div class="table-toolbar">
        <div v-if="selected.length" class="table-toolbar__selection">
          <strong>已选择 {{ selected.length }} 条</strong>
          <MtButton v-if="!readonly" size="small" variant="secondary" @click="emit('bulk-edit', selected)">批量处理</MtButton>
          <MtButton v-if="!readonly" size="small" variant="critical" @click="requestBulkDelete">
            <MtIcon name="regular-trash-s" />批量删除
          </MtButton>
          <MtButton size="small" variant="secondary" @click="exportRecords">
            <MtIcon name="regular-file-export" />批量导出
          </MtButton>
        </div>
        <div class="table-toolbar__tools">
          <MtButton size="small" variant="secondary" :is-loading="loading" @click="reload">
            <MtIcon name="regular-undo-s" />刷新
          </MtButton>
          <MtButton size="small" variant="secondary" @click="openColumnSettings">
            <MtIcon name="regular-table" />列设置
          </MtButton>
          <MtSelect
            v-model="density"
            class="density-select"
            aria-label="表格密度"
            :options="densityOptions"
            hide-clearable-button
            small
          />
          <MtButton square size="small" variant="secondary" :aria-label="fullscreen ? '退出全屏' : '全屏显示'" @click="toggleFullscreen">
            <MtIcon :name="fullscreen ? 'regular-compress-arrows-s' : 'regular-expand-arrows-s'" />
          </MtButton>
        </div>
      </div>

      <div ref="tableRoot" class="table-surface">
        <MtDataTable
          layout="full"
          :data-source="result.items"
          :columns="columns"
          :column-changes="columnChanges"
          :current-page="query.page"
          :pagination-limit="query.limit"
          :pagination-total-items="result.total"
          :pagination-options="[10, 20, 50]"
          :sort-by="query.sortBy"
          :sort-direction="query.sortDirection"
          :selected-rows="selected"
          :allow-row-selection="true"
          :allow-bulk-edit="!readonly && !menuOnly"
          :allow-bulk-delete="!readonly && !menuOnly"
          :bulk-edit-more-actions="bulkMoreActions"
          :disable-edit="readonly || menuOnly"
          :disable-delete="readonly || menuOnly"
          :disable-settings-table="false"
          :enable-reload="true"
          :disable-search="true"
          :is-loading="loading"
          :caption="`${title}数据表格`"
          :show-stripes="showStripes"
          :show-outlines="showOutlines"
          :enable-outline-framing="outlineFraming"
          :additional-context-buttons="rowActions"
          @sort-change="onSort"
          @pagination-limit-change="onLimit"
          @pagination-current-page-change="query.page = $event"
          @selection-change="onSelection"
          @multiple-selection-change="onMultipleSelection"
          @open-details="onOpenDetails"
          @context-select="onContextSelect"
          @item-delete="requestDelete"
          @bulk-edit="emit('bulk-edit', selected)"
          @bulk-delete="requestBulkDelete"
          @reload="reload"
          @change-show-outlines="showOutlines = $event"
          @change-show-stripes="showStripes = $event"
          @change-outline-framing="outlineFraming = $event"
        >
          <template #empty-state>
            <MtEmptyState icon="regular-search" headline="没有匹配结果" description="请调整搜索或筛选条件后重试。" />
          </template>
        </MtDataTable>
      </div>
    </section>

    <ConfirmModal
      v-model:open="confirmOpen"
      title="确认删除"
      :message="confirmMessage"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtButton,
  MtDataTable,
  MtDatepicker,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmptyState,
  MtIcon,
  MtSearch,
  MtSelect,
  useSnackbar,
} from "@contena/meteor-component-library";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import { queryRecords } from "~/composables/useDemoRepository";
import type { DemoRecord, QueryState } from "~/types";

interface FilterDefinition {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

const props = withDefaults(defineProps<{
  title: string;
  addLabel?: string;
  searchPlaceholder?: string;
  items: DemoRecord[];
  columns: any[];
  searchable: string[];
  filters?: FilterDefinition[];
  dateKey?: string;
  readonly?: boolean;
  separateView?: boolean;
  menuOnly?: boolean;
  primaryAction?: "open" | "view";
}>(), {
  addLabel: "新增",
  searchPlaceholder: "输入关键词搜索",
  filters: () => [],
  dateKey: "",
  readonly: false,
  separateView: false,
  menuOnly: false,
  primaryAction: "open",
});

const emit = defineEmits<{
  add: [];
  open: [record: DemoRecord];
  view: [record: DemoRecord];
  delete: [ids: string[]];
  "bulk-edit": [ids: string[]];
}>();

const query = reactive<QueryState>({
  search: "",
  filters: {},
  sortBy: props.columns[0]?.property ?? "",
  sortDirection: "ASC",
  page: 1,
  limit: 20,
});
const searchDraft = ref("");
const filterDraft = reactive<Record<string, string>>(
  Object.fromEntries(props.filters.map((filter) => [filter.key, ""])),
);
const dateDraft = ref<string[] | Date[] | null>(null);
const appliedDateRange = ref<string[] | null>(null);
const selected = ref<string[]>([]);
const loading = ref(false);
const fullscreen = ref(false);
const density = ref<"compact" | "standard">("standard");
const confirmOpen = ref(false);
const pendingDelete = ref<string[]>([]);
const workspace = ref<HTMLElement | null>(null);
const tableRoot = ref<HTMLElement | null>(null);
const showOutlines = ref(false);
const showStripes = ref(false);
const outlineFraming = ref(false);
const columnChanges = reactive<Record<string, Record<string, unknown>>>({});
const { addSnackbar } = useSnackbar();
const densityOptions = [
  { label: "紧凑", value: "compact" },
  { label: "标准", value: "standard" },
];
const rowActions = computed(() => props.menuOnly
  ? [
      { key: "view", label: "查看" },
      { key: "edit", label: "编辑" },
      { key: "delete", label: "删除", type: "critical" as const },
    ]
  : [{ key: "view", label: "查看" }]);
const bulkMoreActions = computed(() => [{
  id: "export",
  label: "批量导出",
  icon: "regular-file-export",
  onClick: exportRecords,
}]);
const columnStorageKey = computed(() => `admin-demo-columns-${props.title}`);

const filteredItems = computed(() => {
  if (!props.dateKey || !appliedDateRange.value?.length) return props.items;

  const [start, end] = appliedDateRange.value;
  return props.items.filter((record) => {
    const value = String(record[props.dateKey]).slice(0, 10);
    return (!start || value >= start) && (!end || value <= end);
  });
});
const result = computed(() => queryRecords(filteredItems.value, query, props.searchable));
const confirmMessage = computed(() => pendingDelete.value.length > 1
  ? `确认删除已选择的 ${pendingDelete.value.length} 条记录吗？此操作不可撤销。`
  : "确认删除这条记录吗？此操作不可撤销。");

onMounted(() => {
  const savedColumns = localStorage.getItem(columnStorageKey.value);
  if (savedColumns) {
    try {
      Object.assign(columnChanges, JSON.parse(savedColumns));
    } catch {
      localStorage.removeItem(columnStorageKey.value);
    }
  }
  document.addEventListener("fullscreenchange", syncFullscreen);
});

onBeforeUnmount(() => document.removeEventListener("fullscreenchange", syncFullscreen));

watch(columnChanges, (value) => {
  if (import.meta.client) localStorage.setItem(columnStorageKey.value, JSON.stringify(value));
}, { deep: true });

watch(() => props.items, () => {
  selected.value = selected.value.filter((id) => props.items.some((item) => item.id === id));
}, { deep: true });

function formatDateValue(value: string | Date | undefined) {
  if (!value) return "";
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  return value.slice(0, 10);
}

function applyFilters() {
  query.search = searchDraft.value;
  query.filters = { ...filterDraft };
  appliedDateRange.value = dateDraft.value ? dateDraft.value.map(formatDateValue) : null;
  query.page = 1;
}

function resetFilters() {
  searchDraft.value = "";
  Object.keys(filterDraft).forEach((key) => { filterDraft[key] = ""; });
  dateDraft.value = null;
  query.search = "";
  query.filters = {};
  appliedDateRange.value = null;
  query.page = 1;
}

function onSort(property: string, direction: "ASC" | "DESC") {
  query.sortBy = property;
  query.sortDirection = direction;
}

function onLimit(limit: number) {
  query.limit = limit;
  query.page = 1;
}

function onSelection(payload: { id: string; value: boolean }) {
  selected.value = payload.value
    ? [...new Set([...selected.value, payload.id])]
    : selected.value.filter((id) => id !== payload.id);
}

function onMultipleSelection(payload: { selections: string[]; value: boolean }) {
  selected.value = payload.value
    ? [...new Set([...selected.value, ...payload.selections])]
    : selected.value.filter((id) => !payload.selections.includes(id));
}

function onContextSelect(payload: { key: string; data: DemoRecord }) {
  if (payload.key === "delete") {
    requestDelete(payload.data);
    return;
  }
  if (payload.key === "edit") {
    emit("open", payload.data);
    return;
  }
  if (payload.key === "view") {
    if (props.separateView) emit("view", payload.data);
    else emit("open", payload.data);
  }
}

function onOpenDetails(record: DemoRecord) {
  if (props.primaryAction === "view") emit("view", record);
  else emit("open", record);
}

function requestDelete(record: DemoRecord) {
  pendingDelete.value = [record.id];
  confirmOpen.value = true;
}

function requestBulkDelete() {
  if (!selected.value.length) return;
  pendingDelete.value = [...selected.value];
  confirmOpen.value = true;
}

function confirmDelete() {
  emit("delete", pendingDelete.value);
  selected.value = [];
  confirmOpen.value = false;
  addSnackbar({ message: "记录已删除", variant: "success" });
}

async function reload() {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 350));
  loading.value = false;
  addSnackbar({ message: "数据已刷新", variant: "success" });
}

function openColumnSettings() {
  const trigger = tableRoot.value?.querySelector<HTMLButtonElement>(
    'button[aria-label="切换表格设置"], button[aria-label="Toggle view settings"]',
  );
  trigger?.click();
}

async function toggleFullscreen() {
  if (!workspace.value) return;
  if (document.fullscreenElement) await document.exitFullscreen();
  else await workspace.value.requestFullscreen();
}

function syncFullscreen() {
  fullscreen.value = document.fullscreenElement === workspace.value;
}

function exportRecords() {
  const source = selected.value.length
    ? props.items.filter((item) => selected.value.includes(item.id))
    : result.value.items;
  const visibleColumns = props.columns.filter((column) => columnChanges[column.property]?.visible !== false);
  const rows = [
    visibleColumns.map((column) => column.label),
    ...source.map((record) => visibleColumns.map((column) => String(record[column.property] ?? ""))),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${props.title}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  addSnackbar({ message: `已导出 ${source.length} 条记录`, variant: "success" });
}
</script>

<style scoped lang="scss">
.enterprise-list-page,
.table-workspace,
.table-surface {
  width: 100%;
  min-width: 0;
}

.page-title-actions,
.filter-toolbar__actions,
.table-toolbar,
.table-toolbar__selection,
.table-toolbar__tools {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.page-title-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.filter-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--scale-size-12);
  padding: 0 0 var(--scale-size-16);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.filter-toolbar__search {
  flex: 1 1 calc(var(--scale-size-256) + var(--scale-size-64));
  min-width: var(--scale-size-256);
  max-width: calc(var(--scale-size-256) + var(--scale-size-96));
}

.filter-toolbar__select {
  flex: 0 1 var(--scale-size-160);
  width: var(--scale-size-160);
}

.filter-toolbar__date {
  flex: 0 1 var(--scale-size-256);
  width: var(--scale-size-256);
}

.table-workspace {
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-default);
  overflow: hidden;
}

.table-workspace:fullscreen {
  padding: var(--scale-size-16);
  background: var(--color-elevation-surface-sunken);
}

.table-toolbar {
  min-height: var(--scale-size-48);
  justify-content: flex-end;
  padding: var(--scale-size-8) var(--scale-size-12);
  border-bottom: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-default);
}

.table-toolbar__selection {
  margin-right: auto;
  min-width: 0;
  flex-wrap: wrap;
}

.table-toolbar__selection strong {
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  white-space: nowrap;
}

.table-toolbar__tools {
  justify-content: flex-end;
}

.density-select {
  width: var(--scale-size-128);
}

.table-surface {
  height: calc(100vh - var(--scale-size-256) - var(--scale-size-48));
  min-height: calc(var(--scale-size-256) + var(--scale-size-256));
  background: var(--color-elevation-surface-default);
}

.table-surface :deep(.mt-data-table) {
  width: 100%;
  max-width: none;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.table-surface :deep(.mt-data-table__table-selection-bulk-edit) {
  display: none;
}

.table-surface :deep(.mt-data-table__table-settings-button > *) {
  opacity: 0;
  pointer-events: none;
}

  .table-surface :deep(.mt-data-table__table-wrapper table) {
  width: 100%;
  min-width: calc(var(--scale-size-256) * 4 + var(--scale-size-32));
}

.table-surface :deep(thead th) {
  background: var(--color-elevation-surface-sunken);
  border-inline: 0;
  border-color: var(--color-border-secondary-default);
  text-transform: none;
}

.table-surface :deep(tbody td) {
  border-inline: 0;
  border-color: var(--color-border-secondary-default);
}

.table-surface :deep(tbody tr:hover td) {
  background: var(--color-interaction-secondary-hover);
}

.table-workspace--compact .table-surface :deep(thead th),
.table-workspace--compact .table-surface :deep(tbody td) {
  padding-block: var(--scale-size-10);
}

.table-workspace--standard .table-surface :deep(thead th),
.table-workspace--standard .table-surface :deep(tbody td) {
  padding-block: var(--scale-size-12);
}

.table-surface :deep([data-cell-column-property="itemCount"]),
.table-surface :deep([data-cell-column-property="amountText"]),
.table-surface :deep([data-cell-column-property="views"]),
.table-surface :deep([data-cell-column-property="orderCount"]),
.table-surface :deep([data-cell-column-property="spentText"]) {
  text-align: right;
}

@media (max-width: 900px) {
  .filter-toolbar__search,
  .filter-toolbar__select,
  .filter-toolbar__date {
    flex: 1 1 calc(50% - var(--scale-size-12));
    width: auto;
    max-width: none;
    min-width: var(--scale-size-192);
  }

  .table-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .table-toolbar__tools {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }
}

@media (max-width: 560px) {
  .page-title-row {
    flex-wrap: wrap;
  }

  .page-title-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .filter-toolbar__search,
  .filter-toolbar__select,
  .filter-toolbar__date {
    flex-basis: 100%;
    min-width: 0;
  }

  .filter-toolbar__actions {
    width: 100%;
  }

  .filter-toolbar__actions > * {
    flex: 1;
  }

  .table-surface {
    height: calc(var(--scale-size-256) * 2 + var(--scale-size-8));
    min-height: calc(var(--scale-size-256) * 2 + var(--scale-size-8));
  }
}
</style>
