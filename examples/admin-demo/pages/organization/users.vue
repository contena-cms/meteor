<template>
  <EntityListPage title="用户管理" add-label="新增用户" search-placeholder="搜索姓名或用户名，按 Enter 查询" :items="records" :columns="columns" :searchable="['name', 'username', 'phone']" :filters="filters" @add="openCreate" @open="openEdit" @delete="remove" @bulk-edit="bulkDisable" />
  <RecordDrawer :open="drawerOpen" kind="user" :record="current" :creating="creating" @close="drawerOpen = false" @save="save" />
</template>

<script setup lang="ts">
import { useSnackbar } from "@contena/meteor-component-library";
import EntityListPage from "~/components/shared/EntityListPage.vue";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";
import { userOptions, users } from "~/data/users";
import type { DemoRecord } from "~/types";
const { records, add, update, remove, bulkUpdate } = useDemoRepository("users", users);
const { addSnackbar } = useSnackbar();
const drawerOpen = ref(false); const creating = ref(false); const current = ref<DemoRecord | null>(null);
const columns: any[] = [
  { label: "姓名", property: "name", renderer: "text", position: 0, sortable: true, clickable: true, width: 150 },
  { label: "用户名", property: "username", renderer: "text", position: 100, sortable: true, clickable: true, width: 150 },
  { label: "部门", property: "department", renderer: "text", position: 200, sortable: true, width: 150 },
  { label: "角色", property: "role", renderer: "text", position: 300, sortable: true, width: 120 },
  { label: "手机号", property: "phone", renderer: "text", position: 400, sortable: false, width: 130 },
  { label: "状态", property: "status", renderer: "text", position: 500, sortable: true, width: 90 },
  { label: "最近登录", property: "lastLogin", renderer: "text", position: 600, sortable: true, width: 160 },
];
const filters = [
  { key: "department", label: "部门", options: userOptions.departments },
  { key: "role", label: "角色", options: userOptions.roles },
  { key: "status", label: "状态", options: [{ label: "正常", value: "启用" }, { label: "未激活", value: "未激活" }, { label: "已停用", value: "停用" }] },
];
function openCreate() { creating.value = true; current.value = null; drawerOpen.value = true; }
function openEdit(record: DemoRecord) { creating.value = false; current.value = record; drawerOpen.value = true; }
function save(record: DemoRecord) { creating.value ? add(record) : update(record.id, record); drawerOpen.value = false; addSnackbar({ message: creating.value ? "用户已创建" : "用户信息已更新", variant: "success" }); }
function bulkDisable(ids: string[]) { const allDisabled = ids.every((id) => records.value.find((user) => user.id === id)?.status === "停用"); bulkUpdate(ids, { status: allDisabled ? "启用" : "停用" }); addSnackbar({ message: allDisabled ? "所选用户已重新启用" : "所选用户已停用，可再次批量编辑以启用", variant: "success" }); }
</script>
