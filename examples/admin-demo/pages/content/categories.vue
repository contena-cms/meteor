<template>
  <div class="page-stack">
    <div class="page-title-row"><div class="page-title-meta"><h1>栏目管理</h1><span class="page-count">共 {{ nodeCount }} 个栏目</span></div><MtButton variant="primary" @click="openAdd(null)"><MtIcon name="regular-plus-s" />新增一级栏目</MtButton></div>
    <div class="category-workspace">
      <div class="category-header"><span></span><span>栏目名称</span><span>编码</span><span>文章数</span><span>状态</span><span>排序</span><span>操作</span></div>
      <CategoryTreeNode v-for="node in tree" :key="node.id" :node="node" @add="openAdd" @edit="openEdit" @toggle="toggle" @delete="requestDelete" />
    </div>
    <AdminDrawer :open="drawerOpen" :title="editing ? '编辑栏目' : '新增栏目'" @close="drawerOpen = false">
      <div class="form-grid"><MtTextField v-model="draft.name" label="栏目名称" /><MtTextField v-model="draft.code" label="栏目编码" /><MtNumberField v-model="draft.sort" label="排序" /><MtSwitch :checked="draft.status === '启用'" label="启用" @change="draft.status = $event ? '启用' : '停用'" /></div>
      <template #footer><MtButton variant="secondary" @click="drawerOpen = false">取消</MtButton><MtButton variant="primary" @click="save">保存</MtButton></template>
    </AdminDrawer>
    <ConfirmModal v-model:open="confirmOpen" message="删除栏目会同时移除其子栏目，确认继续吗？" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { MtButton, MtIcon, MtNumberField, MtSwitch, MtTextField, useSnackbar } from "@contena/meteor-component-library";
import AdminDrawer from "~/components/layout/AdminDrawer.vue";
import CategoryTreeNode from "~/components/categories/CategoryTreeNode.vue";
import ConfirmModal from "~/components/shared/ConfirmModal.vue";
import { categories, type CategoryNode } from "~/data/categories";
const tree = ref<CategoryNode[]>(structuredClone(categories)); const drawerOpen = ref(false); const confirmOpen = ref(false); const editing = ref(false); const parentId = ref<string | null>(null); const deleteId = ref("");
const draft = reactive<CategoryNode>({ id: "", name: "", code: "", count: 0, status: "启用", sort: 10 });
const { addSnackbar } = useSnackbar();
const nodeCount = computed(() => { const count = (nodes: CategoryNode[]): number => nodes.reduce((total, node) => total + 1 + count(node.children ?? []), 0); return count(tree.value); });
function find(nodes: CategoryNode[], id: string): CategoryNode | undefined { for (const node of nodes) { if (node.id === id) return node; const found = find(node.children ?? [], id); if (found) return found; } }
function openAdd(parent: CategoryNode | null) { editing.value = false; parentId.value = parent?.id ?? null; Object.assign(draft, { id: `cat-new-${Date.now()}`, name: "", code: "", count: 0, status: "启用", sort: 10, children: undefined }); drawerOpen.value = true; }
function openEdit(node: CategoryNode) { editing.value = true; parentId.value = null; Object.assign(draft, structuredClone(node)); drawerOpen.value = true; }
function save() { if (!draft.name || !draft.code) return; if (editing.value) Object.assign(find(tree.value, draft.id)!, structuredClone(draft)); else if (parentId.value) { const parent = find(tree.value, parentId.value)!; parent.children = [...(parent.children ?? []), structuredClone(draft)]; } else tree.value.push(structuredClone(draft)); drawerOpen.value = false; addSnackbar({ message: "栏目已保存", variant: "success" }); }
function toggle(node: CategoryNode) { node.status = node.status === "启用" ? "停用" : "启用"; addSnackbar({ message: `栏目已${node.status}`, variant: "success" }); }
function requestDelete(node: CategoryNode) { deleteId.value = node.id; confirmOpen.value = true; }
function removeNode(nodes: CategoryNode[], id: string): CategoryNode[] { return nodes.filter((node) => node.id !== id).map((node) => ({ ...node, children: node.children ? removeNode(node.children, id) : undefined })); }
function confirmDelete() { tree.value = removeNode(tree.value, deleteId.value); confirmOpen.value = false; addSnackbar({ message: "栏目已删除", variant: "success" }); }
</script>

<style scoped lang="scss">
.category-workspace { overflow-x: auto; border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-xs); background: var(--color-elevation-surface-default); }
.category-header { min-width: 900px; height: 40px; display: grid; grid-template-columns: 34px minmax(180px, 1.2fr) 150px 90px 90px 90px minmax(330px, auto); align-items: center; gap: var(--scale-size-8); padding: 0 var(--scale-size-12); color: var(--color-text-secondary-default); background: var(--color-elevation-surface-sunken); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); }
</style>
