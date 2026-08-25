<template>
  <div class="enterprise-list-page">
    <header class="page-title-row">
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
    </header>

    <section ref="workspace" class="table-workspace" :class="`table-workspace--${density}`" aria-label="数据工作区">
      <div v-if="!selected.length" class="table-toolbar">
        <form class="filter-toolbar" aria-label="列表筛选" @submit.prevent="applyFilters">
          <MtSearch
            v-model="searchDraft"
            class="filter-toolbar__search"
            :placeholder="searchPlaceholder"
            @keydown.enter.prevent="applyFilters"
          />
        <MtSelect
          v-for="filter in filters"
          :key="filter.key"
          v-model="filterDraft[filter.key]"
          class="filter-toolbar__select"
          :aria-label="filter.label"
          :placeholder="filter.label"
          :options="[{ label: filter.label, value: '' }, ...filter.options]"
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
          <MtButton v-if="hasActiveFilters" class="filter-toolbar__reset" size="small" variant="tertiary" @click="resetFilters">重置</MtButton>
        </form>
        <div class="table-toolbar__tools" aria-label="表格工具">
          <MtTooltip content="刷新数据">
            <template #default="tooltip">
              <MtButton v-bind="tooltip" square size="small" variant="tertiary" :is-loading="loading" aria-label="刷新" @click="reload">
                <MtIcon name="regular-undo-s" size="var(--scale-size-14)" />
              </MtButton>
            </template>
          </MtTooltip>
          <MtTooltip content="列设置">
            <template #default="tooltip">
              <MtButton v-bind="tooltip" square size="small" variant="tertiary" aria-label="列设置" @click="openColumnSettings">
                <MtIcon name="regular-table" size="var(--scale-size-14)" />
              </MtButton>
            </template>
          </MtTooltip>
          <MtTooltip :content="density === 'standard' ? '切换为紧凑密度' : '切换为标准密度'">
            <template #default="tooltip">
              <MtButton v-bind="tooltip" square size="small" variant="tertiary" aria-label="表格密度" @click="toggleDensity">
                <MtIcon name="regular-view-compact" size="var(--scale-size-14)" />
              </MtButton>
            </template>
          </MtTooltip>
        </div>
      </div>

      <div v-else class="table-toolbar table-toolbar--selection">
        <div class="table-toolbar__selection">
          <MtButton square size="small" variant="tertiary" aria-label="取消选择" @click="selected = []">
            <MtIcon name="regular-times-s" />
          </MtButton>
          <strong>已选择 {{ selected.length }} 条</strong>
          <span>可执行批量操作</span>
        </div>
        <div class="table-toolbar__tools">
          <MtButton v-if="!readonly" size="small" variant="secondary" @click="emit('bulk-edit', selected)">批量处理</MtButton>
          <MtButton size="small" variant="secondary" @click="exportRecords">
            <MtIcon name="regular-file-export" />批量导出
          </MtButton>
          <MtButton v-if="!readonly" size="small" variant="critical" @click="requestBulkDelete">
            <MtIcon name="regular-trash-s" />批量删除
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
          :enable-reload="false"
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
          <template #column-paymentStatus="{ data }">
            <div class="semantic-status">
              <MtStatusDot
                size="s"
                :label="String(data.paymentStatus)"
                :variant="paymentStatusVariant(String(data.paymentStatus))"
              />
              <span>{{ data.paymentStatus }}</span>
            </div>
          </template>
          <template #column-name="{ data }">
            <div class="user-name-cell">
              <MtAvatar v-if="title === '用户管理'" :first-name="String(data.name)" size="xs" />
              <a v-if="title !== '用户管理'" href="#" class="cell-link" @click.prevent="onOpenDetails(data)">{{ data.name }}</a>
              <span v-else class="user-name-cell__text">{{ data.name }}</span>
            </div>
          </template>
          <template #column-status="{ data }">
            <div class="semantic-status">
              <MtStatusDot size="s" :label="displayStatus(String(data.status))" :variant="statusVariant(String(data.status))" />
              <span>{{ displayStatus(String(data.status)) }}</span>
            </div>
          </template>
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
  MtAvatar,
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
  MtStatusDot,
  MtTooltip,
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
const density = ref<"compact" | "standard">("standard");
const confirmOpen = ref(false);
const pendingDelete = ref<string[]>([]);
const tableRoot = ref<HTMLElement | null>(null);
const showOutlines = ref(false);
const showStripes = ref(false);
const outlineFraming = ref(false);
const columnChanges = reactive<Record<string, Record<string, unknown>>>({});
const { addSnackbar } = useSnackbar();
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
const hasActiveFilters = computed(() =>
  Boolean(query.search)
  || Object.values(query.filters).some(Boolean)
  || Boolean(appliedDateRange.value?.some(Boolean)),
);
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
});

watch(columnChanges, (value) => {
  if (import.meta.client) localStorage.setItem(columnStorageKey.value, JSON.stringify(value));
}, { deep: true });

watch(() => props.items, () => {
  selected.value = selected.value.filter((id) => props.items.some((item) => item.id === id));
}, { deep: true });

watch(filterDraft, () => {
  query.filters = { ...filterDraft };
  query.page = 1;
}, { deep: true });

watch(dateDraft, (value) => {
  appliedDateRange.value = value ? value.map(formatDateValue) : null;
  query.page = 1;
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

function paymentStatusVariant(status: string) {
  if (status === "已支付") return "positive" as const;
  if (status === "已退款") return "attention" as const;
  return "neutral" as const;
}

function statusVariant(status: string) {
  if (["启用", "正常", "已发布", "活跃"].includes(status)) return "positive" as const;
  if (["停用", "已停用", "已下线"].includes(status)) return "critical" as const;
  if (["待审核", "未激活"].includes(status)) return "attention" as const;
  return "neutral" as const;
}

function displayStatus(status: string) {
  if (props.title !== "用户管理") return status;
  if (status === "启用") return "正常";
  if (status === "停用") return "已停用";
  return status;
}

function onLimit(limit: number) {
  query.limit = limit;
  query.page = 1;
}

function toggleDensity() {
  density.value = density.value === "standard" ? "compact" : "standard";
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

.enterprise-list-page {
  display: grid;
  gap: 0;
}

.page-title-row,
.page-title-actions,
.filter-toolbar,
.table-toolbar,
.table-toolbar__selection,
.table-toolbar__tools {
  display: flex;
  align-items: center;
}

.page-title-row { justify-content: space-between; gap: var(--scale-size-16); min-height: calc(var(--scale-size-64) + var(--scale-size-12)); margin: 0 calc(var(--scale-size-24) * -1); padding: 0 var(--scale-size-24); background: var(--color-elevation-surface-default); }
.page-title-actions { justify-content: flex-end; gap: var(--scale-size-8); }
.page-title-row h1 { margin: 0; font-size: var(--font-size-l); line-height: var(--font-line-height-l); font-weight: var(--font-weight-semibold); }
.page-title-meta { display: flex; align-items: baseline; gap: var(--scale-size-8); }
.page-count { color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }

.table-workspace { overflow: hidden; border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-s); background: var(--color-elevation-surface-default); }
.table-workspace:fullscreen { padding: var(--scale-size-16); background: var(--color-elevation-surface-sunken); }
.table-toolbar { min-height: calc(var(--scale-size-48) + var(--scale-size-4)); justify-content: space-between; gap: var(--scale-size-12); padding: var(--scale-size-8) var(--scale-size-12); border-bottom: 1px solid var(--color-border-secondary-default); background: var(--color-elevation-surface-default); }
.table-toolbar__selection { margin-right: auto; min-width: 0; gap: var(--scale-size-8); }
.table-toolbar__selection strong { color: var(--color-text-primary-default); font-size: var(--font-size-xs); white-space: nowrap; }
.table-toolbar__selection span { color: var(--color-text-secondary-default); font-size: var(--font-size-xs); white-space: nowrap; }
.table-toolbar__tools { flex: 0 0 auto; justify-content: flex-end; gap: var(--scale-size-4); }
.table-toolbar--selection { background: var(--color-background-brand-default); }

.filter-toolbar {
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: var(--scale-size-8);
  min-width: 0;
}

.filter-toolbar__search {
  flex: 1 1 calc(var(--scale-size-256) + var(--scale-size-64));
  min-width: var(--scale-size-256);
  max-width: calc(var(--scale-size-256) + var(--scale-size-128));
}

.filter-toolbar__search :deep(.mt-search__input) {
  font-family: var(--font-family-body);
}

.filter-toolbar__select {
  flex: 0 1 calc(var(--scale-size-128) + var(--scale-size-16));
  width: var(--scale-size-160);
  margin-bottom: 0;
}

.filter-toolbar__date {
  flex: 0 1 var(--scale-size-256);
  width: var(--scale-size-256);
}
.filter-toolbar__reset { flex: 0 0 auto; }

.table-surface {
  height: calc(100vh - var(--scale-size-224) - var(--scale-size-8));
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

.table-surface :deep(.mt-data-table__pagination-info-text) { display: none; }
.table-surface :deep(.mt-pagination__info-text) { display: none; }

  .table-surface :deep(.mt-data-table__table-wrapper table) {
  width: 100%;
  min-width: calc(var(--scale-size-256) * 4 + var(--scale-size-32));
}

.table-surface :deep(thead th) {
  background: var(--color-elevation-surface-sunken);
  border-inline: 0;
  border-color: var(--color-border-secondary-default);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  text-transform: none;
}

.table-surface :deep(tbody td) {
  border-inline: 0;
  border-color: var(--color-border-secondary-default);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
}

.table-surface :deep([data-cell-column-property="orderNo"] .mt-data-table-text-renderer) {
  color: var(--color-text-brand-default);
  font-weight: var(--font-weight-semibold);
}

.semantic-status {
  display: inline-flex;
  align-items: center;
  gap: var(--scale-size-6);
  color: var(--color-text-secondary-default);
  white-space: nowrap;
}

.table-surface :deep(tbody tr:hover td) {
  background: var(--color-interaction-secondary-hover);
}

.table-surface :deep(tbody tr:has(input[type="checkbox"]:checked) td) {
  background: var(--color-background-brand-default);
}

.user-name-cell { display: inline-flex; align-items: center; gap: var(--scale-size-8); }
.user-name-cell__text { font-weight: var(--font-weight-medium); }
.cell-link { padding: 0; color: var(--color-text-brand-default); border: 0; background: transparent; cursor: pointer; }

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
  .page-title-row { margin-inline: calc(var(--scale-size-16) * -1); padding-inline: var(--scale-size-16); }

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

  .filter-toolbar { width: 100%; }
  .table-toolbar__tools { width: 100%; justify-content: flex-start; overflow-x: auto; }

  .table-surface {
    height: calc(var(--scale-size-256) * 2 + var(--scale-size-8));
    min-height: calc(var(--scale-size-256) * 2 + var(--scale-size-8));
  }
}
</style>
