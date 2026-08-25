<template>
  <div class="page-stack settings-page">
    <div class="page-title-row">
      <h1>系统设置</h1>
      <MtButton variant="primary" :is-loading="saving" @click="save">保存设置</MtButton>
    </div>

    <div class="settings-layout">
      <aside class="settings-navigation" aria-label="设置分类">
        <MtTabs
          vertical
          :items="tabs"
          :default-item="activeTab"
          @new-item-active="activeTab = $event"
        />
      </aside>

      <section class="settings-panel" :aria-label="activeTabLabel">
        <template v-if="activeTab === 'basic'">
          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>基础信息</h2>
              <p>用于后台标题、组织归属和业务联系信息。</p>
            </div>
            <div class="settings-fields">
              <MtTextField v-model="settings.systemName" label="系统名称" />
              <MtTextField v-model="settings.organizationName" label="组织名称" />
              <MtTextField v-model="settings.contactName" label="负责人" />
              <MtTextField v-model="settings.contactPhone" label="联系电话" />
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>区域与语言</h2>
              <p>统一日期计算、业务时区和后台界面语言。</p>
            </div>
            <div class="settings-fields">
              <MtSelect v-model="settings.timezone" label="时区" :options="timezoneOptions" />
              <MtSelect v-model="settings.language" label="默认语言" :options="languageOptions" />
              <MtSelect v-model="settings.weekStart" label="每周起始日" :options="weekStartOptions" />
              <MtSelect v-model="settings.currency" label="默认币种" :options="currencyOptions" />
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>显示格式</h2>
              <p>设置列表、日志和导出文件中的默认展示格式。</p>
            </div>
            <div class="settings-fields">
              <MtSelect v-model="settings.dateFormat" label="日期时间格式" :options="dateOptions" />
              <MtSelect v-model="settings.numberFormat" label="数字格式" :options="numberOptions" />
              <MtSelect v-model="settings.pageSize" label="列表默认每页条数" :options="pageSizeOptions" />
            </div>
          </div>
        </template>

        <template v-else-if="activeTab === 'content'">
          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>内容发布</h2>
              <p>控制内容创建后的默认栏目和发布审核流程。</p>
            </div>
            <div class="settings-fields">
              <MtSelect v-model="settings.defaultCategory" label="默认栏目" :options="articleCategories" />
              <MtSelect v-model="settings.defaultStatus" label="新内容默认状态" :options="contentStatusOptions" />
            </div>
            <div class="settings-toggles">
              <MtSwitch v-model="settings.reviewEnabled" label="发布前需要审核" />
              <MtSwitch v-model="settings.allowScheduledPublish" label="允许定时发布" />
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>编辑体验</h2>
              <p>控制编辑器自动保存和历史版本保留策略。</p>
            </div>
            <div class="settings-fields">
              <MtNumberField v-model="settings.autoSaveMinutes" label="自动保存间隔（分钟）" :min="1" :max="30" />
              <MtNumberField v-model="settings.revisionDays" label="历史版本保留天数" :min="7" :max="365" />
            </div>
          </div>
        </template>

        <template v-else-if="activeTab === 'notification'">
          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>通知渠道</h2>
              <p>选择后台业务消息可以使用的送达渠道。</p>
            </div>
            <div class="settings-toggles">
              <MtSwitch v-model="settings.siteNotification" label="站内通知" />
              <MtSwitch v-model="settings.emailNotification" label="邮件通知" />
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>通知规则</h2>
              <p>重要业务节点发生时向负责人发送提醒。</p>
            </div>
            <div class="settings-toggles">
              <MtSwitch v-model="settings.securityAlert" label="账号安全告警" />
              <MtSwitch v-model="settings.auditReminder" label="内容审核提醒" />
              <MtSwitch v-model="settings.orderException" label="订单异常提醒" />
            </div>
          </div>
        </template>

        <template v-else>
          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>登录安全</h2>
              <p>设置密码周期、失败锁定和登录会话有效期。</p>
            </div>
            <div class="settings-fields">
              <MtNumberField v-model="settings.passwordDays" label="密码有效期（天）" :min="30" :max="365" />
              <MtNumberField v-model="settings.lockAttempts" label="登录失败锁定次数" :min="3" :max="10" />
              <MtNumberField v-model="settings.sessionMinutes" label="登录会话有效期（分钟）" :min="15" :max="1440" />
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-section__heading">
              <h2>高级保护</h2>
              <p>为高权限账号和异地访问启用额外验证。</p>
            </div>
            <div class="settings-toggles">
              <MtSwitch v-model="settings.twoFactor" label="强制双因素认证" />
              <MtSwitch v-model="settings.remoteLoginAlert" label="异地登录提醒" />
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MtButton,
  MtNumberField,
  MtSelect,
  MtSwitch,
  MtTabs,
  MtTextField,
  useSnackbar,
} from "@contena/meteor-component-library";
import { articleCategories } from "~/data/articles";

const storageKey = "admin-demo-settings";
const { addSnackbar } = useSnackbar();
const saving = ref(false);
const activeTab = ref("basic");
const tabs = [
  { label: "基本设置", name: "basic" },
  { label: "内容设置", name: "content" },
  { label: "通知设置", name: "notification" },
  { label: "安全设置", name: "security" },
];
const activeTabLabel = computed(() => tabs.find((tab) => tab.name === activeTab.value)?.label ?? "系统设置");

const settings = reactive({
  systemName: "星云内容中台",
  organizationName: "杭州云帆科技有限公司",
  contactName: "陈管理员",
  contactPhone: "0571-8888 6688",
  timezone: "Asia/Shanghai",
  language: "zh-CN",
  weekStart: "monday",
  currency: "CNY",
  dateFormat: "YYYY-MM-DD HH:mm",
  numberFormat: "zh-CN",
  pageSize: 20,
  defaultCategory: "行业观察",
  defaultStatus: "草稿",
  reviewEnabled: true,
  allowScheduledPublish: true,
  autoSaveMinutes: 5,
  revisionDays: 90,
  siteNotification: true,
  emailNotification: true,
  securityAlert: true,
  auditReminder: true,
  orderException: true,
  passwordDays: 90,
  lockAttempts: 5,
  sessionMinutes: 120,
  twoFactor: false,
  remoteLoginAlert: true,
});

const timezoneOptions = [
  { label: "中国标准时间（UTC+8）", value: "Asia/Shanghai" },
  { label: "协调世界时（UTC）", value: "UTC" },
];
const languageOptions = [{ label: "简体中文", value: "zh-CN" }];
const weekStartOptions = [
  { label: "星期一", value: "monday" },
  { label: "星期日", value: "sunday" },
];
const currencyOptions = [{ label: "人民币（CNY）", value: "CNY" }];
const dateOptions = [
  { label: "2026-08-25 16:30", value: "YYYY-MM-DD HH:mm" },
  { label: "2026/08/25 16:30", value: "YYYY/MM/DD HH:mm" },
];
const numberOptions = [
  { label: "12,345.67", value: "zh-CN" },
  { label: "12 345.67", value: "space" },
];
const pageSizeOptions = [10, 20, 50].map((value) => ({ label: `${value} 条`, value }));
const contentStatusOptions = ["草稿", "待审核"].map((label) => ({ label, value: label }));

onMounted(() => {
  const persisted = localStorage.getItem(storageKey);
  if (!persisted) return;

  try {
    Object.assign(settings, JSON.parse(persisted));
  } catch {
    localStorage.removeItem(storageKey);
  }
});

async function save() {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 450));
  localStorage.setItem(storageKey, JSON.stringify(settings));
  saving.value = false;
  addSnackbar({ message: "系统设置已保存", variant: "success" });
}
</script>

<style scoped lang="scss">
.settings-page {
  width: 100%;
}

.settings-layout {
  display: grid;
  grid-template-columns: var(--scale-size-160) minmax(0, 1fr);
  align-items: start;
  gap: var(--scale-size-20);
}

.settings-navigation {
  position: sticky;
  top: calc(var(--admin-header-height) + var(--scale-size-56));
  width: var(--scale-size-160);
  padding: var(--scale-size-8);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-default);
}

.settings-navigation :deep(.mt-tabs--vertical) {
  gap: var(--scale-size-4);
}

.settings-navigation :deep(.mt-tabs__item) {
  min-height: var(--scale-size-40);
  display: flex;
  align-items: center;
  padding: 0 var(--scale-size-12);
  border: 0;
  border-radius: var(--border-radius-xs);
  color: var(--color-text-secondary-default);
}

.settings-navigation :deep(.mt-tabs__item:hover) {
  background: var(--color-interaction-secondary-hover);
  color: var(--color-text-primary-default);
}

.settings-navigation :deep(.mt-tabs__item--active) {
  background: var(--color-background-brand-default);
  color: var(--color-text-brand-default);
  font-weight: var(--font-weight-semibold);
}

.settings-navigation :deep(.mt-tabs__slider) {
  left: 0;
  background: var(--color-border-brand-default);
}

.settings-panel {
  min-width: 0;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-default);
}

.settings-section {
  display: grid;
  grid-template-columns: minmax(var(--scale-size-192), var(--scale-size-256)) minmax(0, 1fr);
  gap: var(--scale-size-32);
  padding: var(--scale-size-24);
}

.settings-section + .settings-section {
  border-top: 1px solid var(--color-border-secondary-default);
}

.settings-section__heading h2 {
  margin: 0;
  font-size: var(--font-size-m);
  line-height: var(--font-line-height-m);
}

.settings-section__heading p {
  max-width: var(--scale-size-256);
  margin: var(--scale-size-6) 0 0;
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.settings-fields,
.settings-toggles {
  display: grid;
  grid-column: 2;
  grid-template-columns: repeat(2, minmax(var(--scale-size-192), var(--scale-size-256)));
  align-items: end;
  gap: var(--scale-size-16) var(--scale-size-20);
}

.settings-toggles {
  align-content: start;
  align-items: start;
  gap: var(--scale-size-8) var(--scale-size-20);
}

.settings-toggles :deep(.mt-switch) {
  margin: 0;
}

@media (max-width: 1080px) {
  .settings-section {
    grid-template-columns: 1fr;
    gap: var(--scale-size-16);
  }

  .settings-fields,
  .settings-toggles {
    grid-column: 1;
  }
}

@media (max-width: 700px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-navigation {
    position: static;
    width: 100%;
  }

  .settings-navigation :deep(.mt-tabs--vertical) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .settings-navigation :deep(.mt-tabs__slider) {
    display: none;
  }

  .settings-section {
    padding: var(--scale-size-16);
  }

  .settings-fields,
  .settings-toggles {
    grid-template-columns: 1fr;
  }
}
</style>
