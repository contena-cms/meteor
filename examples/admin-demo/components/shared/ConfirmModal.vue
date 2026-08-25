<template>
  <MtModalRoot :is-open="open" @change="emit('update:open', $event)">
    <MtModal :title="title" width="s">
      <p>{{ message }}</p>
      <template #footer>
        <div class="confirm-actions">
          <MtModalClose as="span"><MtButton variant="secondary">取消</MtButton></MtModalClose>
          <MtButton variant="critical" :is-loading="loading" @click="emit('confirm')">确认删除</MtButton>
        </div>
      </template>
    </MtModal>
  </MtModalRoot>
</template>

<script setup lang="ts">
import { MtButton, MtModal, MtModalClose, MtModalRoot } from "@contena/meteor-component-library";
defineProps<{ open: boolean; title?: string; message?: string; loading?: boolean }>();
const emit = defineEmits<{ "update:open": [value: boolean]; confirm: [] }>();
</script>

<style scoped>.confirm-actions { width: 100%; display: flex; justify-content: flex-end; gap: var(--scale-size-8); }</style>
