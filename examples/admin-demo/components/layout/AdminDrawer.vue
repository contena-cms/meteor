<template>
  <Teleport to="body">
    <div v-if="open" class="admin-drawer-layer">
      <div class="admin-drawer-backdrop" aria-hidden="true" @click="requestClose" />
      <section
        ref="drawer"
        class="admin-drawer"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown.esc="requestClose"
      >
        <header class="admin-drawer__header">
          <div>
            <h2 :id="titleId">{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
          <MtButton square variant="secondary" aria-label="关闭抽屉" @click="requestClose">
            <MtIcon name="regular-times-s" />
          </MtButton>
        </header>
        <div class="admin-drawer__content"><slot /></div>
        <footer v-if="$slots.footer" class="admin-drawer__footer"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { MtButton, MtIcon } from "@contena/meteor-component-library";
import { nextTick, onBeforeUnmount, ref, useId, watch } from "vue";

const props = defineProps<{ open: boolean; title: string; subtitle?: string; dirty?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const drawer = ref<HTMLElement>();
const titleId = useId();
let lastFocused: HTMLElement | null = null;

watch(() => props.open, async (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    await nextTick();
    drawer.value?.focus();
  } else {
    document.body.style.overflow = "";
    lastFocused?.focus();
  }
});

onBeforeUnmount(() => { document.body.style.overflow = ""; });

function requestClose() {
  if (props.dirty && !window.confirm("有未保存的更改，确认关闭吗？")) return;
  emit("close");
}
</script>

<style scoped lang="scss">
.admin-drawer-layer { position: fixed; inset: 0; z-index: 1450; }
.admin-drawer-backdrop { position: absolute; inset: 0; background: var(--color-elevation-backdrop-default); }
.admin-drawer { position: absolute; inset: 0 0 0 auto; width: min(620px, 100vw); display: grid; grid-template-rows: auto minmax(0, 1fr) auto; background: var(--color-elevation-surface-raised); box-shadow: -8px 0 28px var(--color-elevation-shadow-default); outline: none; }
.admin-drawer__header { min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: var(--scale-size-16); padding: var(--scale-size-16) var(--scale-size-24); border-bottom: 1px solid var(--color-border-secondary-default); }
.admin-drawer__header h2 { margin: 0; font-size: var(--font-size-l); }
.admin-drawer__header p { margin: var(--scale-size-4) 0 0; color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }
.admin-drawer__content { min-height: 0; overflow: auto; padding: var(--scale-size-24); }
.admin-drawer__footer { display: flex; justify-content: flex-end; gap: var(--scale-size-8); padding: var(--scale-size-12) var(--scale-size-24); border-top: 1px solid var(--color-border-secondary-default); background: var(--color-elevation-surface-default); }
@media (max-width: 560px) { .admin-drawer { width: 100vw; } .admin-drawer__content { padding: var(--scale-size-16); } }
</style>
