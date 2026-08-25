<template>
  <div class="admin-shell" :class="{ 'admin-shell--collapsed': collapsed }">
    <AdminSidebar :groups="groups" :collapsed="mobileOpen ? false : collapsed" :mobile-open="mobileOpen" @toggle="toggleSidebar" @mobile-close="mobileOpen = false" />
    <div class="admin-shell__main">
      <AdminHeader @open-menu="mobileOpen = true" />
      <nav v-if="current && currentGroup" class="admin-breadcrumb" aria-label="面包屑">
        <span v-if="!currentGroup.isPrimary">{{ currentGroup.label }}</span>
        <MtIcon v-if="!currentGroup.isPrimary" name="regular-chevron-right-s" aria-hidden="true" />
        <NuxtLink :to="current.path" aria-current="page">{{ current.label }}</NuxtLink>
      </nav>
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MtIcon } from "@contena/meteor-component-library";
import AdminHeader from "~/components/layout/AdminHeader.vue";
import AdminSidebar from "~/components/layout/AdminSidebar.vue";
const { groups, current, currentGroup } = useNavigation();
const collapsed = ref(false);
const mobileOpen = ref(false);
onMounted(() => { collapsed.value = localStorage.getItem("admin-demo-sidebar") === "collapsed"; });
function toggleSidebar() { collapsed.value = !collapsed.value; localStorage.setItem("admin-demo-sidebar", collapsed.value ? "collapsed" : "expanded"); }
</script>

<style scoped lang="scss">
.admin-shell { min-height: 100vh; background: var(--color-elevation-surface-sunken); }
.admin-shell__main { min-width: 0; margin-left: var(--admin-sidebar-width); transition: margin-left 180ms ease; }
.admin-shell--collapsed .admin-shell__main { margin-left: var(--admin-sidebar-collapsed-width); }
.admin-breadcrumb { height: var(--scale-size-36); display: flex; align-items: center; gap: var(--scale-size-6); padding: 0 var(--scale-size-24); color: var(--color-text-secondary-default); border-bottom: 1px solid var(--color-border-secondary-default); background: var(--color-elevation-surface-default); font-size: var(--font-size-2xs); }
.admin-breadcrumb a { color: var(--color-text-primary-default); font-weight: var(--font-weight-semibold); }
.admin-content { min-width: 0; padding: 0 var(--scale-size-24) var(--scale-size-32); }
@media (max-width: 900px) { .admin-shell__main, .admin-shell--collapsed .admin-shell__main { margin-left: 0; } .admin-content { padding: var(--scale-size-16); } .admin-breadcrumb { padding: 0 var(--scale-size-16); } }
</style>
