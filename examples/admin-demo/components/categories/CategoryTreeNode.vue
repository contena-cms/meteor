<template>
  <MtCollapsible :default-open="level < 2">
    <div class="category-row" :style="{ '--level': level }">
      <MtCollapsibleTrigger v-if="node.children?.length" as-child>
        <MtButton square variant="secondary" :aria-label="`展开${node.name}`"><MtIcon name="regular-chevron-down-s" /></MtButton>
      </MtCollapsibleTrigger>
      <span v-else class="tree-spacer" />
      <strong>{{ node.name }}</strong><code>{{ node.code }}</code><span>{{ node.count }} 篇</span>
      <MtBadge :variant="node.status === '启用' ? 'positive' : 'neutral'">{{ node.status }}</MtBadge>
      <span>排序 {{ node.sort }}</span>
      <div class="category-actions">
        <MtButton variant="secondary" size="small" @click="emit('add', node)">新增子栏目</MtButton>
        <MtButton variant="secondary" size="small" @click="emit('edit', node)">编辑</MtButton>
        <MtButton variant="secondary" size="small" @click="emit('toggle', node)">{{ node.status === '启用' ? '停用' : '启用' }}</MtButton>
        <MtButton variant="critical" size="small" @click="emit('delete', node)">删除</MtButton>
      </div>
    </div>
    <MtCollapsibleContent v-if="node.children?.length">
      <CategoryTreeNode v-for="child in node.children" :key="child.id" :node="child" :level="level + 1" @add="emit('add', $event)" @edit="emit('edit', $event)" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
    </MtCollapsibleContent>
  </MtCollapsible>
</template>

<script setup lang="ts">
import { MtBadge, MtButton, MtCollapsible, MtCollapsibleContent, MtCollapsibleTrigger, MtIcon } from "@contena/meteor-component-library";
import type { CategoryNode } from "~/data/categories";
withDefaults(defineProps<{ node: CategoryNode; level?: number }>(), { level: 0 });
const emit = defineEmits<{ add: [node: CategoryNode]; edit: [node: CategoryNode]; toggle: [node: CategoryNode]; delete: [node: CategoryNode] }>();
</script>

<style scoped lang="scss">
.category-row { min-width: 900px; min-height: 48px; display: grid; grid-template-columns: 34px minmax(180px, 1.2fr) 150px 90px 90px 90px minmax(330px, auto); align-items: center; gap: var(--scale-size-8); padding: var(--scale-size-6) var(--scale-size-12) var(--scale-size-6) calc(var(--scale-size-12) + var(--level) * 24px); border-bottom: 1px solid var(--color-border-secondary-default); }
.category-row:hover { background: var(--color-elevation-surface-hover); }
.category-row code, .category-row > span { color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }
.tree-spacer { width: 32px; }.category-actions { display: flex; justify-content: flex-end; gap: var(--scale-size-6); }
</style>
