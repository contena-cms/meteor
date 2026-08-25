<template>
  <AdminDrawer :open="open" :title="drawerTitle" :subtitle="subtitle" :dirty="dirty" @close="emit('close')">
    <template v-if="kind === 'article'">
      <MtTabs :items="articleTabs" :default-item="articleTab" @new-item-active="articleTab = $event" />
      <div v-if="articleTab === 'basic'" class="drawer-form">
        <MtTextField v-model="draft.title" class="full" label="文章标题" required />
        <MtSelect v-model="draft.category" label="栏目" :options="articleCategories" />
        <MtSelect v-model="draft.status" label="状态" :options="articleStatusOptions" />
        <MtTextarea v-model="draft.summary" class="full" label="摘要" />
        <MtTextEditor v-model="draft.content" class="full" label="正文" />
      </div>
      <div v-else class="drawer-form"><MtDatepicker v-model="publishDate" label="计划发布时间" /><MtSwitch :checked="Boolean(draft.featured)" label="推荐到首页" @change="draft.featured = $event" /></div>
    </template>
    <template v-else-if="kind === 'user'">
      <MtTabs :items="userTabs" :default-item="userTab" @new-item-active="userTab = $event" />
      <div v-if="userTab === 'basic'" class="drawer-form">
        <MtTextField v-model="draft.name" label="姓名" required />
        <MtTextField v-model="draft.username" label="用户名" required />
        <MtEmailField v-model="draft.email" label="邮箱" />
        <MtTextField v-model="draft.phone" label="手机号" />
        <MtSelect v-model="draft.department" label="部门" :options="userOptions.departments" />
        <MtSelect v-model="draft.role" label="角色" :options="userOptions.roles" />
        <MtSelect v-model="draft.gender" label="性别" :options="genderOptions" />
        <MtSwitch :checked="draft.status !== '停用'" label="账号启用" @change="draft.status = $event ? '启用' : '停用'" />
        <MtTextarea v-model="draft.note" class="full" label="备注" />
      </div>
      <div v-else class="security-panel"><MtBanner variant="info" title="安全信息">密码由用户首次登录时设置，管理员无法查看现有密码。</MtBanner><MtSwitch :checked="true" label="要求下次登录修改密码" /></div>
    </template>
    <template v-else-if="kind === 'customer'">
      <div class="drawer-form">
        <MtTextField v-model="draft.name" label="客户姓名" /><MtTextField v-model="draft.phone" label="手机号（脱敏）" />
        <MtSelect v-model="draft.level" label="客户等级" :options="levelOptions" /><MtSelect v-model="draft.source" label="客户来源" :options="sourceOptions" />
        <MtSwitch :checked="draft.status === '活跃'" label="活跃状态" @change="draft.status = $event ? '活跃' : '流失'" />
      </div>
      <h3 class="section-heading">消费概览</h3><dl class="detail-list"><dt>累计订单</dt><dd>{{ draft.orderCount }} 笔</dd><dt>累计消费</dt><dd>{{ draft.spentText }}</dd><dt>最近活跃</dt><dd>{{ draft.lastActive }}</dd></dl>
    </template>
    <template v-else-if="kind === 'order' && mode !== 'view'">
      <div class="drawer-form">
        <MtTextField v-model="draft.orderNo" label="订单号" required />
        <MtTextField v-model="draft.customer" label="客户名称" required />
        <MtSelect v-model="draft.channel" label="订单渠道" :options="orderChannelOptions" />
        <MtNumberField v-model="draft.itemCount" label="商品数量" :min="1" :max="999" />
        <MtNumberField v-model="draft.amount" label="应付金额（元）" :min="0" />
        <MtDatepicker v-model="orderCreatedAt" label="下单时间" />
        <MtSelect v-model="draft.paymentStatus" label="支付状态" :options="paymentStatusOptions" />
        <MtSelect v-model="draft.fulfillmentStatus" label="履约状态" :options="fulfillmentStatusOptions" />
        <MtTextarea v-model="draft.address" class="full" label="收货地址" />
      </div>
    </template>
    <template v-else>
      <dl class="detail-list"><template v-for="field in detailFields" :key="field.key"><dt>{{ field.label }}</dt><dd>{{ draft[field.key] ?? '-' }}</dd></template></dl>
      <template v-if="kind === 'order'"><h3 class="section-heading">商品明细</h3><div class="order-line"><span>企业内容协作服务 × {{ draft.itemCount }}</span><strong>{{ draft.amountText }}</strong></div><h3 class="section-heading">收货信息</h3><p>{{ draft.address }}</p></template>
      <template v-if="kind === 'log'"><h3 class="section-heading">请求摘要</h3><MtBanner :variant="draft.result === '成功' ? 'positive' : 'critical'" :title="String(draft.summary) ">IP：{{ draft.ip }}，敏感字段已隐藏。</MtBanner><h3 class="section-heading">字段变更</h3><dl class="detail-list"><dt>变更前</dt><dd>{{ draft.before }}</dd><dt>变更后</dt><dd>{{ draft.after }}</dd></dl></template>
    </template>
    <template #footer>
      <MtButton variant="secondary" @click="emit('close')">关闭</MtButton>
      <template v-if="kind === 'article'"><MtButton variant="secondary" @click="saveAs('草稿')">保存草稿</MtButton><MtButton variant="secondary" @click="saveAs('待审核')">提交审核</MtButton><MtButton variant="primary" @click="saveAs('已发布')">发布</MtButton></template>
      <MtButton v-else-if="kind === 'user' || kind === 'customer' || (kind === 'order' && mode !== 'view')" variant="primary" @click="save">保存</MtButton>
    </template>
  </AdminDrawer>
</template>

<script setup lang="ts">
import { MtBanner, MtButton, MtDatepicker, MtEmailField, MtNumberField, MtSelect, MtSwitch, MtTabs, MtTextEditor, MtTextarea, MtTextField } from "@contena/meteor-component-library";
import AdminDrawer from "~/components/layout/AdminDrawer.vue";
import { articleCategories } from "~/data/articles";
import { userOptions } from "~/data/users";
import type { DemoRecord } from "~/types";
import { computed, reactive, ref, toRaw, watch } from "vue";
const props = defineProps<{ open: boolean; kind: "article" | "user" | "customer" | "order" | "log"; record: DemoRecord | null; creating?: boolean; mode?: "create" | "edit" | "view" }>();
const emit = defineEmits<{ close: []; save: [record: DemoRecord] }>();
const draft = reactive<DemoRecord>({ id: "" });
const initial = ref(""); const articleTab = ref("basic"); const userTab = ref("basic"); const publishDate = ref(new Date("2026-08-26T09:00:00+08:00")); const orderCreatedAt = ref<string | null>(null);
const articleTabs = [{ label: "基本信息", name: "basic" }, { label: "发布配置", name: "config" }];
const userTabs = [{ label: "基本信息", name: "basic" }, { label: "安全信息", name: "security" }];
const articleStatusOptions = ["草稿", "待审核", "已发布", "已下线"].map((label) => ({ label, value: label }));
const genderOptions = ["男", "女", "其他"].map((label) => ({ label, value: label }));
const levelOptions = ["普通客户", "银牌客户", "金牌客户", "战略客户"].map((label) => ({ label, value: label }));
const sourceOptions = ["官网注册", "销售录入", "活动线索", "渠道推荐"].map((label) => ({ label, value: label }));
const orderChannelOptions = ["直营网店", "企业采购", "渠道分销", "线下合同"].map((label) => ({ label, value: label }));
const paymentStatusOptions = ["待支付", "已支付", "已退款"].map((label) => ({ label, value: label }));
const fulfillmentStatusOptions = ["待处理", "处理中", "已完成", "已关闭"].map((label) => ({ label, value: label }));
const detailFields = computed(() => props.kind === "order" ? [
  { key: "orderNo", label: "订单号" }, { key: "customer", label: "客户" }, { key: "channel", label: "渠道" }, { key: "amountText", label: "应付金额" }, { key: "paymentStatus", label: "支付状态" }, { key: "fulfillmentStatus", label: "履约状态" }, { key: "createdAt", label: "下单时间" },
] : [
  { key: "time", label: "时间" }, { key: "operator", label: "操作人" }, { key: "module", label: "模块" }, { key: "action", label: "动作" }, { key: "object", label: "对象" }, { key: "result", label: "结果" },
]);
const drawerTitle = computed(() => props.kind === "order"
  ? props.mode === "view" ? "订单详情" : props.mode === "create" ? "新增订单" : "编辑订单"
  : props.kind === "log" ? "日志详情" : `${props.creating ? "新增" : "编辑"}${{ article: "文章", user: "用户", customer: "客户" }[props.kind]}`);
const subtitle = computed(() => props.record?.id ? `记录编号：${props.record.id}` : "填写以下信息后保存");
const dirty = computed(() => JSON.stringify(draft) !== initial.value);
watch(() => [props.open, props.record], () => {
  if (!props.open) return;
  Object.keys(draft).forEach((key) => delete draft[key]);
  Object.assign(draft, cloneRecord(props.record ?? emptyRecord()));
  orderCreatedAt.value = props.kind === "order" ? toIsoDate(String(draft.createdAt ?? "")) : null;
  initial.value = JSON.stringify(draft);
  articleTab.value = "basic";
  userTab.value = "basic";
}, { immediate: true, deep: true });
function emptyRecord(): DemoRecord {
  if (props.kind === "order") {
    return {
      id: `order-${Date.now()}`,
      orderNo: `CT${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`,
      customer: "",
      channel: "企业采购",
      itemCount: 1,
      amount: 0,
      amountText: "¥0.00",
      paymentStatus: "待支付",
      fulfillmentStatus: "待处理",
      createdAt: "2026-08-25 10:00",
      address: "浙江省杭州市滨江区",
    };
  }
  return { id: `${props.kind}-${Date.now()}`, name: "", title: "", username: "", email: "", phone: "", department: "内容运营部", role: "内容管理员", gender: "男", status: props.kind === "customer" ? "活跃" : "启用", category: "行业观察", summary: "", content: "", featured: false, level: "普通客户", source: "官网注册", orderCount: 0, spentText: "¥0.00", lastActive: "-" };
}
function toIsoDate(value: string) { return value ? value.replace(" ", "T") + ":00+08:00" : null; }
function cloneRecord(record: DemoRecord) { return structuredClone(toRaw(record)); }
function save() {
  if (props.kind === "order" && orderCreatedAt.value) {
    draft.createdAt = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(orderCreatedAt.value)).replaceAll("/", "-");
  }
  emit("save", cloneRecord(draft));
}
function saveAs(status: string) { draft.status = status; save(); }
</script>

<style scoped lang="scss">
.drawer-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--scale-size-16); margin-top: var(--scale-size-20); }
.drawer-form .full { grid-column: 1 / -1; }
.security-panel { display: grid; gap: var(--scale-size-20); margin-top: var(--scale-size-20); }
.order-line { display: flex; justify-content: space-between; padding: var(--scale-size-12); border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-xs); }
@media (max-width: 560px) { .drawer-form { grid-template-columns: 1fr; } .drawer-form .full { grid-column: auto; } }
</style>
