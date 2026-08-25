<template>
  <aside
    class="admin-sidebar"
    :class="{
      'admin-sidebar--collapsed': collapsed,
      'admin-sidebar--mobile-open': mobileOpen,
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="admin-sidebar__brand">
      <div v-if="!collapsed || !hovered" class="brand-mark" aria-hidden="true">
        <MtIcon name="regular-layer-group" size="var(--scale-size-16)" />
      </div>
      <div v-if="!collapsed" class="brand-copy">
        <strong>星云内容中台</strong>
        <span>企业运营工作台</span>
      </div>
      <MtButton
        v-if="hovered || mobileOpen"
        class="sidebar-toggle"
        square
        size="small"
        variant="tertiary"
        :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="emit('toggle')"
      >
        <MtIcon :name="collapsed ? 'regular-chevron-right-s' : 'regular-chevron-left-s'" size="var(--scale-size-14)" />
      </MtButton>
    </div>

    <nav class="admin-sidebar__nav" aria-label="主导航">
      <NuxtLink
        v-if="primaryGroup"
        :to="primaryGroup.children[0]?.path"
        class="nav-primary"
        :class="{ 'nav-primary--active': isActive(primaryGroup) }"
        :title="collapsed ? primaryGroup.label : undefined"
        @click="emit('mobile-close')"
      >
        <MtIcon :name="primaryGroup.icon" size="var(--scale-size-16)" aria-hidden="true" />
        <span v-if="!collapsed">{{ primaryGroup.label }}</span>
      </NuxtLink>

      <div v-if="!collapsed" class="nav-divider" />

      <template v-for="group in secondaryGroups" :key="group.label">
        <section
          class="nav-group"
          :class="{
            'nav-group--active': isActive(group),
            'nav-group--open': isGroupOpen(group),
          }"
        >
          <MtButton
            v-if="!collapsed"
            class="nav-group__trigger"
            variant="tertiary"
            size="small"
            block
            :aria-expanded="isGroupOpen(group)"
            :aria-controls="`nav-group-${group.label}`"
            @click="toggleGroup(group.label)"
          >
            <MtIcon :name="group.icon" size="var(--scale-size-16)" aria-hidden="true" />
            <span>{{ group.label }}</span>
            <MtIcon
              class="nav-group__chevron"
              :name="isGroupOpen(group) ? 'regular-chevron-up-s' : 'regular-chevron-down-s'"
              size="var(--scale-size-12)"
              aria-hidden="true"
            />
          </MtButton>

          <MtPopover v-else :title="group.label" width="medium">
            <template #trigger="{ toggleFloatingUi }">
              <MtButton
                class="nav-collapsed-trigger"
                square
                size="small"
                variant="tertiary"
                :aria-label="group.label"
                :title="group.label"
                @click="toggleFloatingUi"
              >
                <MtIcon :name="group.icon" size="var(--scale-size-18)" aria-hidden="true" />
                <span v-if="isActive(group)" class="nav-collapsed-trigger__dot" aria-hidden="true" />
              </MtButton>
            </template>
            <template #popover-items__base="{ toggleFloatingUi }">
              <MtPopoverItem
                v-for="item in group.children"
                :key="item.path"
                :label="item.label"
                :type="route.path === item.path ? 'active' : 'default'"
                :on-label-click="() => navigateFromPopover(item.path, toggleFloatingUi)"
              />
            </template>
          </MtPopover>

          <div
            v-if="!collapsed && isGroupOpen(group)"
            :id="`nav-group-${group.label}`"
            class="nav-group__items"
          >
            <NuxtLink
              v-for="item in group.children"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'nav-item--active': route.path === item.path }"
              :aria-current="route.path === item.path ? 'page' : undefined"
              @click="emit('mobile-close')"
            >{{ item.label }}</NuxtLink>
          </div>
        </section>
      </template>
    </nav>
    <div v-if="!collapsed" class="admin-sidebar__help">
      <MtIcon name="regular-question-circle" size="var(--scale-size-16)" aria-hidden="true" />
      <span>帮助与反馈</span>
    </div>
  </aside>
  <div v-if="mobileOpen" class="mobile-sidebar-backdrop" @click="emit('mobile-close')" />
</template>

<script setup lang="ts">
import {
  MtButton,
  MtIcon,
  MtPopover,
  MtPopoverItem,
} from "@contena/meteor-component-library";
import type { NavigationGroup } from "~/types";

const props = defineProps<{
  groups: NavigationGroup[];
  collapsed: boolean;
  mobileOpen: boolean;
}>();
const emit = defineEmits<{ toggle: []; "mobile-close": [] }>();
const route = useRoute();
const hovered = ref(false);
const openGroups = ref<string[]>([]);
const storageKey = "admin-demo-open-nav-groups";

const primaryGroup = computed(() => props.groups.find((group) => group.isPrimary));
const secondaryGroups = computed(() => props.groups.filter((group) => !group.isPrimary));

onMounted(() => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      openGroups.value = JSON.parse(saved).filter((label: unknown) =>
        secondaryGroups.value.some((group) => group.label === label),
      ).slice(-1);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }
  syncActiveGroup();
});

watch(() => route.path, syncActiveGroup);
watch(openGroups, (value) => localStorage.setItem(storageKey, JSON.stringify(value)), { deep: true });

function isActive(group: NavigationGroup) {
  return group.children.some((item) => route.path === item.path);
}

function isGroupOpen(group: NavigationGroup) {
  return openGroups.value.includes(group.label);
}

function syncActiveGroup() {
  const active = secondaryGroups.value.find((group) => isActive(group));
  if (active) {
    openGroups.value = [active.label];
  }
}

function toggleGroup(label: string) {
  openGroups.value = openGroups.value.includes(label)
    ? openGroups.value.filter((item) => item !== label)
    : [label];
}

async function navigateFromPopover(path: string, close: () => void) {
  close();
  emit("mobile-close");
  await navigateTo(path);
}
</script>

<style scoped lang="scss">
.admin-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 800;
  width: var(--admin-sidebar-width);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--color-slate-950);
  border-right: 1px solid var(--color-slate-900);
  transition: width 180ms ease, transform 180ms ease;
}

.admin-sidebar--collapsed {
  width: var(--admin-sidebar-collapsed-width);
}

.admin-sidebar__brand {
  position: sticky;
  top: 0;
  z-index: 2;
  height: var(--admin-header-height);
  display: flex;
  align-items: center;
  gap: var(--scale-size-10);
  padding: 0 var(--scale-size-14);
  border-bottom: 1px solid var(--color-slate-900);
  background: var(--color-slate-950);
}

.brand-mark {
  width: var(--scale-size-30);
  height: var(--scale-size-30);
  flex: 0 0 var(--scale-size-30);
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-xs);
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
  font-weight: var(--font-weight-bold);
}

.brand-mark :deep(.mt-icon) {
  color: var(--color-text-static-default);
}

.brand-copy {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: var(--scale-size-2);
}

.brand-copy strong {
  overflow: hidden;
  color: var(--color-text-static-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-copy span {
  color: var(--color-slate-500);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.sidebar-toggle {
  flex: 0 0 auto;
  color: var(--color-slate-400);
}

.sidebar-toggle :deep(.mt-icon) { color: var(--color-slate-400); }

.admin-sidebar--collapsed .admin-sidebar__brand {
  justify-content: center;
  padding-inline: 0;
}

.admin-sidebar__nav {
  flex: 1;
  align-content: start;
  display: grid;
  gap: var(--scale-size-6);
  padding: var(--scale-size-14) var(--scale-size-10) var(--scale-size-24);
}

.admin-sidebar__help {
  height: calc(var(--scale-size-48) + var(--scale-size-4));
  display: flex;
  align-items: center;
  gap: var(--scale-size-10);
  padding: 0 var(--scale-size-20);
  color: var(--color-slate-500);
  border-top: 1px solid var(--color-slate-900);
  font-size: var(--font-size-xs);
}

.nav-divider {
  height: 1px;
  margin: var(--scale-size-4) var(--scale-size-8) var(--scale-size-8);
  background: var(--color-slate-900);
}

.nav-primary,
.nav-group__trigger,
.nav-collapsed-trigger {
  color: var(--color-slate-300);
}

.nav-primary {
  min-height: var(--scale-size-36);
  display: flex;
  align-items: center;
  gap: var(--scale-size-10);
  padding: 0 var(--scale-size-10);
  border-left: var(--scale-size-2) solid transparent;
  border-radius: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.nav-primary > :deep(.mt-icon),
.nav-group__trigger > :deep(.mt-icon:first-child),
.nav-collapsed-trigger > :deep(.mt-icon) {
  flex: 0 0 auto;
}

.nav-primary:hover,
.nav-group__trigger:hover,
.nav-collapsed-trigger:hover {
  background: var(--color-slate-900);
  color: var(--color-text-static-default);
}

.nav-primary:focus-visible,
.nav-group__trigger:focus-visible,
.nav-collapsed-trigger:focus-visible,
.nav-item:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: -2px;
}

.nav-primary--active {
  border-left-color: var(--color-border-brand-default);
  background: var(--color-slate-900);
  color: var(--color-text-static-default);
  font-weight: var(--font-weight-semibold);
}

.nav-group {
  display: grid;
  gap: var(--scale-size-2);
}

.nav-group__trigger {
  min-height: var(--scale-size-36);
  justify-content: flex-start;
  gap: var(--scale-size-10);
  padding-inline: var(--scale-size-10);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: left;
}

.nav-group--active .nav-group__trigger {
  color: var(--color-text-static-default);
}

.nav-group__chevron {
  margin-left: auto;
  color: var(--color-slate-500);
}

.nav-group__items {
  display: grid;
  gap: 0;
  padding-left: var(--scale-size-24);
}

.nav-item {
  min-height: var(--scale-size-32);
  display: flex;
  align-items: center;
  padding: 0 var(--scale-size-10);
  border-left: var(--scale-size-2) solid transparent;
  color: var(--color-slate-500);
  font-size: var(--font-size-xs);
}

.nav-item:hover {
  background: var(--color-slate-900);
  color: var(--color-text-static-default);
}

.nav-item--active {
  border-left-color: var(--color-border-brand-default);
  background: var(--color-slate-900);
  color: var(--color-text-static-default);
  font-weight: var(--font-weight-semibold);
}

.nav-group--active .nav-group__trigger :deep(.mt-icon:first-child) {
  color: var(--color-icon-brand-default);
}

.nav-collapsed-trigger {
  position: relative;
  width: 100%;
  min-height: var(--scale-size-40);
}

.admin-sidebar--collapsed .admin-sidebar__nav {
  padding-inline: var(--scale-size-8);
}

.admin-sidebar--collapsed .nav-primary {
  min-height: var(--scale-size-40);
  justify-content: center;
  padding-inline: 0;
}

.nav-collapsed-trigger__dot {
  position: absolute;
  inset: var(--scale-size-8) auto var(--scale-size-8) 0;
  width: var(--scale-size-2);
  background: var(--color-interaction-primary-default);
}

@media (max-width: 900px) {
  .admin-sidebar,
  .admin-sidebar--collapsed {
    z-index: 1200;
    width: min(296px, 84vw);
    transform: translateX(-100%);
  }

  .admin-sidebar--mobile-open {
    transform: translateX(0);
  }

  .admin-sidebar--collapsed .brand-copy,
  .admin-sidebar--collapsed .nav-group__trigger,
  .admin-sidebar--collapsed .nav-collapsed-trigger {
    display: none;
  }

  .admin-sidebar--collapsed .nav-primary {
    justify-content: flex-start;
  }

  .mobile-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1100;
    background: var(--color-elevation-backdrop-default);
  }
}

@media (min-width: 901px) {
  .mobile-sidebar-backdrop {
    display: none;
  }
}
</style>
