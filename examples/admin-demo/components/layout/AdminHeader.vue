<template>
  <header class="admin-header">
    <div class="admin-header__start">
      <MtButton
        class="mobile-menu"
        square
        variant="tertiary"
        aria-label="打开菜单"
        @click="emit('open-menu')"
      >
        <MtIcon name="regular-bars-alt-s" />
      </MtButton>

      <MtPopover class="global-search" title="全局搜索" width="large">
        <template #trigger="{ isOpened, toggleFloatingUi }">
          <MtSearch
            :model-value="search"
            placeholder="搜索文章、用户和订单"
            @focus="openSearchResults(isOpened, toggleFloatingUi)"
            @update:model-value="updateSearch($event, isOpened, toggleFloatingUi)"
          />
        </template>
        <template #popover-items__base="{ toggleFloatingUi }">
          <MtPopoverItem
            v-for="result in results"
            :key="result.path + result.label"
            :label="result.label"
            :contextual-detail="result.type"
            :on-label-click="() => openSearchResult(result.path, toggleFloatingUi)"
          />
          <p v-if="search && !results.length" class="global-search__empty">未找到匹配结果</p>
          <p v-if="!search" class="global-search__empty">输入关键词后搜索文章、用户或订单</p>
        </template>
      </MtPopover>
    </div>

    <div class="admin-header__actions" aria-label="系统工具">
      <MtPopover title="消息通知" width="medium">
        <template #trigger="{ toggleFloatingUi }">
          <div class="notification-button">
            <MtButton square variant="tertiary" aria-label="查看消息" @click="toggleFloatingUi">
              <MtIcon name="regular-bell" />
            </MtButton>
            <MtBadge variant="info" size="s">3</MtBadge>
          </div>
        </template>
        <template #popover-items__base>
          <MtPopoverItem label="2 篇文章等待审核" contextual-detail="内容管理" />
          <MtPopoverItem label="1 笔退款等待处理" contextual-detail="订单管理" />
          <MtPopoverItem label="安全策略已更新" contextual-detail="系统设置" />
        </template>
      </MtPopover>

      <MtDropdownMenuRoot>
        <MtDropdownMenuTrigger as-child>
          <MtButton square variant="tertiary" aria-label="切换主题">
            <MtIcon :name="theme === 'dark' ? 'regular-moon' : 'regular-sun'" />
          </MtButton>
        </MtDropdownMenuTrigger>
        <MtDropdownMenuPortal>
          <MtActionMenu>
            <MtActionMenuGroup>
              <MtActionMenuItem
                icon="regular-sun"
                @select="setTheme('light')"
              >亮色<span v-if="theme === 'light'">（当前）</span></MtActionMenuItem>
              <MtActionMenuItem
                icon="regular-moon"
                @select="setTheme('dark')"
              >暗色<span v-if="theme === 'dark'">（当前）</span></MtActionMenuItem>
            </MtActionMenuGroup>
          </MtActionMenu>
        </MtDropdownMenuPortal>
      </MtDropdownMenuRoot>

      <div class="header-separator" />

      <MtDropdownMenuRoot>
        <MtDropdownMenuTrigger as-child>
          <MtButton class="user-trigger" variant="tertiary">
            <MtAvatar first-name="陈" last-name="管理员" size="s" />
            <span class="user-trigger__copy">
              <strong>陈管理员</strong>
              <small>平台管理员</small>
            </span>
            <MtIcon name="regular-chevron-down-s" aria-hidden="true" />
          </MtButton>
        </MtDropdownMenuTrigger>
        <MtDropdownMenuPortal>
          <MtActionMenu>
            <MtActionMenuGroup>
              <MtActionMenuItem icon="regular-user" @select="showProfile">个人资料</MtActionMenuItem>
            </MtActionMenuGroup>
            <MtActionMenuGroup>
              <MtActionMenuItem icon="regular-sign-out" variant="critical" @select="logout">退出登录</MtActionMenuItem>
            </MtActionMenuGroup>
          </MtActionMenu>
        </MtDropdownMenuPortal>
      </MtDropdownMenuRoot>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAvatar,
  MtBadge,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPopover,
  MtPopoverItem,
  MtSearch,
  useSnackbar,
  useTheme,
} from "@contena/meteor-component-library";
import { articles } from "~/data/articles";
import { orders } from "~/data/orders";
import { users } from "~/data/users";

const emit = defineEmits<{ "open-menu": [] }>();
const search = ref("");
const { theme, setTheme } = useTheme({ storageKey: "admin-demo-theme" });
const { addSnackbar } = useSnackbar();
const { logout: clearAuth } = useAuth();

const results = computed(() => {
  const term = search.value.toLocaleLowerCase("zh-CN");
  return [
    ...articles.filter((item) => String(item.title).toLocaleLowerCase("zh-CN").includes(term)).slice(0, 3).map((item) => ({ type: "文章", label: String(item.title), path: "/content/articles" })),
    ...users.filter((item) => `${item.name}${item.username}`.toLocaleLowerCase("zh-CN").includes(term)).slice(0, 3).map((item) => ({ type: "用户", label: `${item.name}（${item.username}）`, path: "/organization/users" })),
    ...orders.filter((item) => `${item.orderNo}${item.customer}`.toLocaleLowerCase("zh-CN").includes(term)).slice(0, 3).map((item) => ({ type: "订单", label: `${item.orderNo} · ${item.customer}`, path: "/business/orders" })),
  ].slice(0, 6);
});

onMounted(() => {
  if (theme.value === "system") setTheme("light");
});

function showProfile() {
  addSnackbar({ message: "个人资料已是最新状态", variant: "success" });
}

function openSearchResults(isOpened: boolean, toggle: () => void) {
  if (!isOpened) toggle();
}

function updateSearch(value: string, isOpened: boolean, toggle: () => void) {
  search.value = value;
  openSearchResults(isOpened, toggle);
}

async function openSearchResult(path: string, close: () => void) {
  close();
  search.value = "";
  await navigateTo(path);
}

async function logout() {
  clearAuth();
  await navigateTo("/login");
}
</script>

<style scoped lang="scss">
.admin-header {
  position: sticky;
  top: 0;
  z-index: 700;
  height: var(--admin-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-16);
  padding: 0 var(--scale-size-20);
  border-bottom: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-default);
}

.admin-header__start,
.admin-header__actions,
.notification-button,
.user-trigger {
  display: flex;
  align-items: center;
}

.admin-header__start {
  min-width: 0;
  flex: 1;
  gap: var(--scale-size-12);
}

.global-search {
  width: min(calc(var(--scale-size-256) + var(--scale-size-96)), 38vw);
}

.global-search :deep(.mt-floating-ui),
.global-search :deep(.mt-floating-ui__trigger) {
  width: 100%;
}

.global-search :deep(.mt-search) {
  background: var(--color-elevation-surface-sunken);
  border-color: transparent;
}

.global-search :deep(.mt-search__input) {
  font-family: var(--font-family-body);
}

.global-search__empty {
  margin: 0;
  padding: var(--scale-size-12) var(--scale-size-8);
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
}

.admin-header__actions {
  flex: 0 0 auto;
  gap: var(--scale-size-4);
}

.notification-button {
  position: relative;
}

.notification-button :deep(.mt-badge) {
  position: absolute;
  top: calc(var(--scale-size-2) * -1);
  right: calc(var(--scale-size-2) * -1);
  min-width: var(--scale-size-18);
  height: var(--scale-size-18);
  justify-content: center;
  pointer-events: none;
}

.header-separator {
  width: var(--scale-size-1);
  height: var(--scale-size-24);
  margin-inline: var(--scale-size-6);
  background: var(--color-border-secondary-default);
}

.user-trigger {
  min-width: 0;
  gap: var(--scale-size-8);
  padding-inline: var(--scale-size-8);
  border-left: 1px solid transparent;
}

.user-trigger__copy {
  display: grid;
  text-align: left;
}

.user-trigger__copy strong {
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.user-trigger__copy small {
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.mobile-menu {
  display: none;
}

@media (max-width: 900px) {
  .mobile-menu {
    display: inline-flex;
  }

  .admin-header {
    padding: 0 var(--scale-size-12);
  }

  .global-search {
    width: min(calc(var(--scale-size-256) + var(--scale-size-64)), 52vw);
  }
}

@media (max-width: 620px) {
  .global-search {
    flex: 1;
    width: auto;
  }

  .user-trigger__copy,
  .user-trigger > :deep(.mt-icon),
  .header-separator {
    display: none;
  }

  .admin-header__actions {
    gap: 0;
  }
}
</style>
