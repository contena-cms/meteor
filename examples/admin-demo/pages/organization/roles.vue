<template>
  <div class="page-stack">
    <div class="page-title-row"><div class="page-title-meta"><h1>角色权限</h1><span class="page-count">共 {{ records.length }} 个角色</span></div><MtButton variant="primary" @click="openCreate"><MtIcon name="regular-plus-s" />新增角色</MtButton></div>
    <MtDataTable :data-source="records" :columns="columns" :current-page="1" :pagination-limit="10" :pagination-total-items="records.length" :disable-search="true" :enable-reload="true" caption="角色列表" @open-details="openEdit" @item-delete="requestDelete" />
    <AdminDrawer :open="drawerOpen" :title="creating ? '新增角色' : '编辑角色权限'" @close="drawerOpen = false">
      <div class="form-grid"><MtTextField v-model="draft.name" label="角色名称" /><MtTextField v-model="draft.scope" label="权限范围" /><MtSwitch :checked="draft.status === '启用'" label="启用" @change="draft.status = $event ? '启用' : '停用'" /></div>
      <h3 class="section-heading">权限矩阵</h3>
      <div class="permission-table">
        <div class="permission-row permission-head"><span>模块</span><span v-for="action in permissionActions" :key="action">{{ action }}</span></div>
        <div v-for="module in permissionModules" :key="module" class="permission-row"><MtCheckbox :model-value="moduleChecked(module)" :label="module" @update:model-value="setModule(module, $event)" /><MtCheckbox v-for="action in permissionActions" :key="action" :model-value="permissions.has(`${module}:${action}`)" :aria-label="`${module}${action}`" @update:model-value="setPermission(module, action, $event)" /></div>
      </div>
      <template #footer><MtButton variant="secondary" @click="drawerOpen = false">取消</MtButton><MtButton variant="primary" @click="save">保存角色</MtButton></template>
    </AdminDrawer>
    <ConfirmModal v-model:open="confirmOpen" message="删除角色不会删除其成员，但成员将失去该角色权限。" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { MtButton, MtCheckbox, MtDataTable, MtIcon, MtSwitch, MtTextField, useSnackbar } from "@contena/meteor-component-library";
import AdminDrawer from "~/components/layout/AdminDrawer.vue";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import { permissionActions, permissionModules, roles } from "~/data/roles";
import type { DemoRecord } from "~/types";
const { records, add, update, remove } = useDemoRepository("roles", roles); const { addSnackbar } = useSnackbar();
const drawerOpen = ref(false); const confirmOpen = ref(false); const creating = ref(false); const deleteId = ref(""); const permissions = ref(new Set<string>()); const draft = reactive<DemoRecord>({ id: "", name: "", scope: "", status: "启用", members: 0, updatedAt: "" });
const columns: any[] = [
  { label: "角色名称", property: "name", renderer: "text", position: 0, sortable: true, clickable: true, width: 180 }, { label: "成员数", property: "members", renderer: "number", position: 100, sortable: true, width: 100 },
  { label: "权限范围", property: "scope", renderer: "text", position: 200, width: 220 }, { label: "更新时间", property: "updatedAt", renderer: "text", position: 300, width: 160 },
  { label: "状态", property: "status", renderer: "badge", position: 400, width: 100, rendererOptions: { renderItemBadge: (data: DemoRecord) => ({ label: data.status, variant: data.status === "启用" ? "positive" : "neutral" }) } },
];
function resetPermissions(enabled: boolean) { permissions.value = new Set(enabled ? permissionModules.flatMap((module) => permissionActions.map((action) => `${module}:${action}`)) : []); }
function openCreate() { creating.value = true; Object.assign(draft, { id: `role-${Date.now()}`, name: "", scope: "自定义", status: "启用", members: 0, updatedAt: "2026-08-25 16:00" }); resetPermissions(false); drawerOpen.value = true; }
function openEdit(record: DemoRecord) { creating.value = false; Object.assign(draft, structuredClone(record)); resetPermissions(record.name === "超级管理员"); if (!permissions.value.size) permissionModules.forEach((module) => permissions.value.add(`${module}:查看`)); drawerOpen.value = true; }
function moduleChecked(module: string) { return permissionActions.every((action) => permissions.value.has(`${module}:${action}`)); }
function setModule(module: string, checked: boolean) { permissionActions.forEach((action) => checked ? permissions.value.add(`${module}:${action}`) : permissions.value.delete(`${module}:${action}`)); permissions.value = new Set(permissions.value); }
function setPermission(module: string, action: string, checked: boolean) { checked ? permissions.value.add(`${module}:${action}`) : permissions.value.delete(`${module}:${action}`); permissions.value = new Set(permissions.value); }
function save() { creating.value ? add(structuredClone(draft)) : update(draft.id, structuredClone(draft)); drawerOpen.value = false; addSnackbar({ message: "角色权限已保存", variant: "success" }); }
function requestDelete(record: DemoRecord) { deleteId.value = record.id; confirmOpen.value = true; }
function confirmDelete() { remove([deleteId.value]); confirmOpen.value = false; addSnackbar({ message: "角色已删除", variant: "success" }); }
</script>

<style scoped lang="scss">
.permission-table { min-width: 560px; border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-xs); overflow: hidden; }
.permission-row { min-height: 42px; display: grid; grid-template-columns: minmax(140px, 1fr) repeat(6, 54px); align-items: center; padding: 0 var(--scale-size-12); border-bottom: 1px solid var(--color-border-secondary-default); }.permission-row:last-child { border-bottom: 0; }.permission-head { background: var(--color-elevation-surface-sunken); color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }.permission-table { overflow-x: auto; }
</style>
