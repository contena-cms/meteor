# Meteor 企业管理后台 Demo 实现规格

> 本文件是给代码实现 AI 的执行文档。请在当前目录完成可运行的 Demo，不要只输出设计稿、静态 HTML、说明文字或半成品页面。

## 1. 目标

在 `examples/admin-demo` 实现一个使用 Vue 3/Nuxt 3 和 Meteor Component Library 的企业级管理后台 Demo，用来验证 Meteor 在中国常见 CMS、ERP、CRM 和综合管理系统中的实际效果。

这个 Demo 必须做到：

- 第一屏就是可使用的登录页，不做产品营销落地页。
- 登录后展示完整后台壳层、工作台和多个真实感业务模块。
- 所有数据使用本地假数据，不请求后端接口。
- 所有菜单、按钮、筛选、分页、增改、删除和主题切换都必须可交互。
- 视觉上是紧凑、清晰、克制的中国企业后台，不照搬电商店铺或海外 SaaS 营销风格。
- 用实际页面证明 Meteor 可以支撑高信息密度的企业管理系统。

## 2. 强制技术约束

### 2.1 技术栈

- Nuxt 3，配置为客户端管理应用，`ssr: false`。
- Vue 3 Composition API、`<script setup lang="ts">` 和 TypeScript。
- 使用 Nuxt pages/router，不额外安装另一套路由库。
- 使用 `vue-i18n`，默认语言为简体中文 `zh-CN`。
- 使用 `@contena/meteor-component-library` 的 workspace 版本。
- 使用 Vitest 做逻辑和组件测试，Playwright 做关键流程与视觉验收。
- 包管理器只使用仓库现有的 pnpm。

建议的 `package.json`：

```json
{
  "name": "admin-demo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@contena/meteor-component-library": "workspace:*",
    "nuxt": "^3.10.3",
    "vue": "^3.5.0",
    "vue-i18n": "^9.9.1"
  },
  "devDependencies": {
    "@nuxt/test-utils": "latest",
    "@playwright/test": "^1.45.0",
    "@types/node": "^20.11.28",
    "@vue/test-utils": "^2.4.2",
    "sass": "^1.69.5",
    "typescript": "~5.7.3",
    "vitest": "^3.0.5",
    "vue-tsc": "^2.2.4"
  }
}
```

版本可根据当前 workspace 锁文件调整，但不得更换框架或 UI 库。

### 2.2 只使用 Meteor UI

- 可见的按钮、表单、表格、标签、状态、弹窗、通知、分页、图表和图标优先且必须使用 Meteor 组件。
- 只使用 `Mt*` 导出和 `mt-*` 标签，不使用已经弃用的 `Sw*` 别名。
- 禁止安装或使用 Ant Design Vue、Element Plus、Naive UI、Arco Design、VXE、Tailwind UI、shadcn 或其他 UI 组件库。
- 禁止用原生 `<button>`、`<input>`、`<select>` 自己复刻 Meteor 已经提供的控件。
- 普通语义布局元素如 `main`、`aside`、`header`、`nav`、`section`、`div` 可以使用。
- 如果 Meteor 没有某个结构组件，可以创建项目内的布局组合组件，但组合组件内部的操作控件仍必须使用 Meteor。
- 不要修改 `packages/component-library` 来迎合 Demo；若发现真实能力缺口，在 README 末尾记录，不要偷偷复制组件源码。
- 不使用 `@contena/meteor-admin-sdk`。这是独立展示应用，不运行在 Contena Administration 宿主中。

在 Nuxt 全局样式中加载：

```ts
export default defineNuxtConfig({
  ssr: false,
  css: [
    "@contena/meteor-component-library/styles.css",
    "@contena/meteor-component-library/font.css",
    "~/assets/css/main.scss",
  ],
});
```

业务 SFC 显式导入使用到的 Meteor 组件，保持 tree-shaking。不要为了省事全局注册整个组件库。

### 2.3 实现前必须核对组件 API

不要根据名字猜测 props 和事件。实现每类控件前先阅读对应源码或 Storybook 示例：

- `packages/component-library/src/components/<component>`
- `*.stories.ts`
- `*.interactive.stories.ts`

特别是 `MtDataTable`、`MtChart`、`MtModal`、`MtTabs` 和 `MtSelect`，必须以当前仓库 API 为准。

## 3. 产品和视觉方向

### 3.1 目标气质

后台名称使用“星云内容中台”，组织名称使用“杭州云帆科技有限公司”。

整体气质：

- 安静、专业、紧凑、可靠。
- 以中性色背景、白色工作面和 Meteor 品牌蓝作为主操作色。
- 状态色只表达成功、警告、错误和信息，不作为大面积装饰。
- 不使用渐变球、光斑、插画 Hero、大标题营销文案或漂浮卡片式落地页。
- 页面强调扫描效率、数据比较和重复操作效率。
- 中文文案自然、简短，不使用 Lorem ipsum 或“功能演示”等开发者语言。

### 3.2 信息密度

- 桌面端以 1280 至 1600 像素宽度为主要工作环境。
- 顶栏高度约 52px，侧栏展开宽度约 216px，收起宽度约 64px。
- 页面内容间距以 Meteor 的 `--scale-size-*` Token 为准，通常控制在 16px 至 24px。
- 列表页面标题、统计数量和主按钮放在同一标题行。
- 筛选区紧跟标题区，不为每个筛选条件创建卡片。
- 表格直接作为主工作面，不把表格再嵌套进多层装饰卡片。
- 页面标题使用正常后台字号，不使用 Hero 级超大字体。
- 表格、筛选器、分页和批量操作在 900px 高度的屏幕中应尽量同时可见。

### 3.3 Token 规则

- 颜色、字号、圆角、间距、边框和阴影优先使用 Meteor Token，例如：
  - `--color-elevation-surface-sunken`
  - `--color-elevation-surface-default`
  - `--color-elevation-surface-raised`
  - `--color-border-primary-default`
  - `--color-border-secondary-default`
  - `--color-text-primary-default`
  - `--color-text-secondary-default`
  - `--color-interaction-primary-default`
  - `--scale-size-*`
  - `--font-size-*`
- 不要复制 Ant、Element 或其他系统的颜色变量。
- 不要为了一个页面建立大量 `--demo-*` 变量；只有跨多个布局组件复用的尺寸才允许定义项目变量。
- 组件私有样式写在对应 `.vue` 文件的 `<style lang="scss">` 中。`assets/css/main.scss` 只放 reset、页面根布局和真正的全局规则。

## 4. 应用结构

建议目录：

```text
examples/admin-demo/
├── README.md
├── app.vue
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── assets/css/main.scss
├── components/
│   ├── layout/
│   │   ├── AdminShell.vue
│   │   ├── AdminSidebar.vue
│   │   ├── AdminHeader.vue
│   │   ├── AdminBreadcrumb.vue
│   │   └── AdminDrawer.vue
│   ├── dashboard/
│   └── shared/
├── composables/
│   ├── useAuth.ts
│   ├── useNavigation.ts
│   ├── useDemoRepository.ts
│   └── useThemePreference.ts
├── data/
│   ├── users.ts
│   ├── articles.ts
│   ├── orders.ts
│   ├── customers.ts
│   ├── roles.ts
│   └── logs.ts
├── layouts/default.vue
├── middleware/auth.global.ts
├── pages/
├── plugins/i18n.ts
├── types/
└── tests/
```

不要为了“架构完整”创建空文件。只有真实复用或承担明确职责时才拆组件。

## 5. 登录与应用壳层

### 5.1 登录页 `/login`

- 保留 Meteor/Contena 风格的简洁登录页，表单居中，品牌信号清晰。
- 使用 `MtTextField`、`MtPasswordField`、`MtCheckbox`、`MtButton`、`MtBanner`。
- 用户名和密码标签、输入内容全部左对齐。
- 不在输入框左侧放图标。
- 测试账号：用户名 `admin`，密码 `meteor`。
- 错误账号显示 Meteor critical banner。
- 提交时展示约 500ms loading，然后进入 `/dashboard`。
- “保持登录”写入 localStorage；退出时清除登录态。
- 适配 390px 手机宽度，表单不得溢出。

### 5.2 后台壳层

登录后的所有页面使用同一个 `AdminShell`：

```text
┌──────────────┬─────────────────────────────────────────────┐
│ Logo / 折叠  │ 顶栏：全局搜索、消息、主题、用户             │
├──────────────┼─────────────────────────────────────────────┤
│              │ 面包屑                                      │
│  分组菜单     ├─────────────────────────────────────────────┤
│              │ 页面标题 / 数量 / 主操作                     │
│              │ 筛选与业务内容                               │
│              │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

侧栏要求：

- 一级菜单有 Meteor 图标，二级菜单不要图标。
- 菜单分组明确，不使用十几个没有层次的平铺入口。
- 展开状态显示品牌名、菜单文字和当前项；收起状态只显示一级图标和 Tooltip。
- 鼠标进入收起的侧栏区域时，顶部 Logo 区显示展开图标；点击后展开。不是只有鼠标移到 Logo 本身才出现。
- 展开状态提供收起按钮。
- 侧栏顶部与内容区顶栏高度严格一致。
- 当前路由、父级展开状态和刷新后的菜单状态必须正确。
- 小于 900px 时侧栏变为遮罩抽屉，不挤压主内容。

顶栏要求：

- 使用 `MtSearch` 做全局搜索，搜索文章、用户和订单，结果使用 `MtPopover` 展示并可跳转。
- 消息入口显示未读数量，使用 `MtBadge` 或 `MtStatusDot`。
- 用户入口使用 `MtAvatar` 和 `MtActionMenu`，包含个人资料、主题和退出登录。
- 使用 `MtThemeProvider` 和 `MtThemeSelect` 支持亮色、暗色和跟随系统。
- 不在顶栏堆放没有行为的装饰按钮。

## 6. 菜单与路由

所有菜单项都必须有真实页面，不允许点击后仍停留在工作台。

| 分组     | 菜单     | 路由                  | 页面重点                         |
| -------- | -------- | --------------------- | -------------------------------- |
| 工作     | 工作台   | `/dashboard`          | 指标、趋势、待办、最近业务       |
| 内容管理 | 文章管理 | `/content/articles`   | 完整列表、筛选、增改、批量操作   |
| 内容管理 | 栏目管理 | `/content/categories` | 树形层级与状态管理               |
| 业务中心 | 订单管理 | `/business/orders`    | 高密度订单表格、金额、状态、详情 |
| 业务中心 | 客户管理 | `/business/customers` | 客户资料、等级、来源、最近活动   |
| 组织权限 | 用户管理 | `/organization/users` | 用户 CRUD、状态、角色、部门      |
| 组织权限 | 角色权限 | `/organization/roles` | 角色列表与权限矩阵               |
| 系统管理 | 系统设置 | `/system/settings`    | 分组表单、主题和通知设置         |
| 系统管理 | 操作日志 | `/system/logs`        | 时间、操作人、模块、结果、详情   |

## 7. 页面要求

### 7.1 工作台

必须包含：

- 4 个紧凑指标：今日订单、今日成交额、待审核文章、活跃用户。
- 指标显示当前值、环比和清晰状态，不使用只有颜色没有文字的表达。
- 使用 `MtChart` 展示近 14 天业务趋势，至少包含成交额和订单量两个序列。
- 待办事项列表：内容审核、库存预警、待处理退款、账号安全。
- 最近订单表格，展示订单号、客户、金额、状态、时间。
- 快捷操作：新建文章、新建用户、查看日志。
- 指标卡允许使用 `MtCard`，但禁止卡片嵌套卡片。

### 7.2 通用列表页基准

文章、订单、客户、用户和日志页面共用以下视觉与交互基准：

- 只有一个主标题区，避免“页面标题 + 表格标题”形成双表头。
- 标题左侧显示模块名和数据总数，右侧显示主操作按钮。
- 标题下方是紧凑筛选条，包括 `MtSearch`、必要的 `MtSelect`、`MtDatepicker` 和重置操作。
- 主表格使用 `MtDataTable`，不要自己画 HTML table。
- 启用 Meteor 表格原生的排序、列显示/隐藏、列顺序、列宽、刷新和分页能力。
- 启用全选、当前页选择、批量编辑、批量删除。
- 行级编辑、删除、查看使用表格原生事件和 `MtActionMenu`。
- 状态使用 `MtBadge` 或 `MtStatusDot` 的语义 variant，不自定义刺眼颜色标签。
- 分页可选 10、20、50 条，默认 20 条。
- 搜索、筛选、排序、分页必须真正改变本地结果。
- 删除前使用 `MtModal` 二次确认，成功后使用 `useSnackbar` 通知。
- 过滤无结果时显示 `MtEmptyState`，加载时使用组件自身 loading 或 `MtSkeletonBar`。

`MtDataTable` 已提供 filters、column settings、row selection、bulk edit、bulk delete、sorting 和 pagination。优先使用这些能力，不要再创建一套列设置弹窗。

### 7.3 增改与详情交互

- 新增、编辑和详情统一从右侧抽屉打开，不跳到空白独立页。
- 项目内实现 `AdminDrawer` 作为布局组合，因为组件库目前没有 Drawer。
- 抽屉桌面宽度约 560px 至 640px，手机端全屏。
- 抽屉包含固定标题区、可滚动内容区和固定底部操作区。
- 支持 Escape 关闭、遮罩关闭、关闭确认、焦点可见和正确的 `role="dialog"`/`aria-modal`。
- 抽屉内按钮使用 `MtButton`，表单控件全部使用 Meteor。
- 字段不要紧贴左右边缘，表单垂直间距紧凑但清楚。
- 长表单使用 `MtTabs` 分为“基本信息”“权限/配置”“安全信息”等逻辑组。

### 7.4 文章管理

假数据至少 28 条，字段包括：标题、栏目、作者、状态、浏览量、更新时间。

功能：

- 按关键词、栏目、状态和更新时间筛选。
- 草稿、待审核、已发布、已下线四种状态。
- 新增/编辑抽屉使用 `MtTextField`、`MtSelect`、`MtTextarea`、`MtTextEditor`、`MtDatepicker` 和 `MtSwitch`。
- 支持保存草稿、提交审核和发布三种明确操作。

### 7.5 栏目管理

- 至少 3 层、18 个栏目节点。
- 使用紧凑层级列表，配合 `MtCollapsible` 展开子栏目。
- 展示栏目名称、编码、文章数、状态和排序。
- 支持新增子栏目、编辑、启用/停用和删除确认。

### 7.6 订单管理

假数据至少 36 条，金额统一使用人民币格式。

字段包括：订单号、客户、渠道、商品数、应付金额、支付状态、履约状态、下单时间。

功能：

- 按订单号/客户、支付状态、履约状态和日期范围筛选。
- 详情抽屉展示商品明细、金额汇总、收货信息和操作记录。
- 状态至少覆盖待支付、已支付、处理中、已完成、已关闭。

### 7.7 客户管理

假数据至少 24 条，字段包括：姓名、手机号脱敏、等级、来源、订单数、累计消费、最近活跃、状态。

- 支持搜索、等级/来源/状态筛选。
- 详情抽屉展示基础资料、标签、消费概览和最近订单。
- 手机号只展示假数据，并默认脱敏。

### 7.8 用户管理

假数据至少 32 条，字段包括：姓名、用户名、部门、角色、手机号、状态、最近登录。

- 支持搜索、部门、角色和状态筛选。
- 支持全选、批量启用、批量停用和批量删除。
- 新增/编辑字段：姓名、用户名、邮箱、手机号、部门、角色、性别、状态、备注。
- 性别使用 `MtRadioGroupRoot`、`MtRadioGroupList`、`MtRadioGroupItem` 组合或 `MtSelect`，不要手写难看的方框控件。
- 状态切换使用 `MtSwitch`。
- 角色和部门选项来自本地假数据，不写死在模板中。

### 7.9 角色权限

- 至少 6 个角色：超级管理员、内容管理员、审核员、运营专员、客服、只读访客。
- 角色列表显示成员数、权限范围、更新时间和状态。
- 编辑抽屉提供按模块分组的权限矩阵：查看、新增、编辑、删除、审核、导出。
- 权限项使用 `MtCheckbox`，支持整组全选和半选状态。

### 7.10 系统设置

使用 `MtTabs` 分为：

- 基本设置：系统名称、时区、日期格式、默认语言。
- 内容设置：默认栏目、审核开关、自动保存间隔。
- 通知设置：站内通知、邮件通知、安全告警。
- 安全设置：密码有效期、登录失败锁定、双因素开关。

保存必须展示 loading 和成功 Snackbar。切换 Tab 不丢失未保存的本地状态。

### 7.11 操作日志

假数据至少 48 条，字段包括：时间、操作人、模块、动作、对象、IP、结果。

- 支持关键词、模块、结果和日期筛选。
- 结果使用成功/失败语义状态。
- 点击行打开只读详情抽屉，展示请求摘要和变更前后字段。
- 不展示真实 Token、密码或敏感信息。

## 8. 假数据和状态管理

- 假数据放在 `data/*.ts`，使用稳定固定 ID，禁止每次渲染随机生成导致测试不稳定。
- 使用符合中国业务语境的姓名、部门、订单号、文章标题和日期。
- 金额使用 `Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" })`。
- 日期统一使用 `Asia/Shanghai` 语义和 `YYYY-MM-DD HH:mm` 展示。
- 使用 composable repository 封装查询、分页、增改、删除，不把过滤逻辑散落在页面模板中。
- 操作延迟模拟 250ms 至 600ms，用于展示 loading，但测试可通过注入方式关闭延迟。
- 登录态、主题、侧栏状态和列表列配置可保存到 localStorage。
- CRUD 数据至少在当前浏览器会话内保持一致；刷新后可恢复初始假数据或 localStorage 数据，但行为必须明确且稳定。

## 9. 组件映射

| 场景                        | 必须优先使用                                                                    |
| --------------------------- | ------------------------------------------------------------------------------- |
| 主要/次要/危险操作          | `MtButton`                                                                      |
| 图标                        | `MtIcon`，图标名从 `packages/icon-kit/icons` 中选择                             |
| 搜索                        | `MtSearch`                                                                      |
| 文本、密码、邮箱、URL、数字 | `MtTextField`、`MtPasswordField`、`MtEmailField`、`MtUrlField`、`MtNumberField` |
| 多行和富文本                | `MtTextarea`、`MtTextEditor`                                                    |
| 选项                        | `MtSelect`、`MtRadioGroup*`、`MtCheckbox`、`MtSwitch`                           |
| 日期                        | `MtDatepicker`                                                                  |
| 列表和批量操作              | `MtDataTable`                                                                   |
| 状态                        | `MtBadge`、`MtStatusDot`、`MtBanner`                                            |
| 卡片                        | `MtCard`，只用于指标或真正独立的信息单元                                        |
| 趋势图                      | `MtChart`                                                                       |
| 页内标签                    | `MtTabs`                                                                        |
| 操作菜单                    | `MtActionMenu`、`MtActionMenuItem`、`MtActionMenuGroup`                         |
| 弹窗确认                    | `MtModal*`                                                                      |
| 空状态和加载                | `MtEmptyState`、`MtLoader`、`MtSkeletonBar`                                     |
| 通知                        | `MtSnackbar`、`useSnackbar`、`MtToast`                                          |
| 用户                        | `MtAvatar`                                                                      |
| 主题                        | `MtThemeProvider`、`MtThemeSelect`、`useTheme`                                  |

不要使用 `MtEntityDataTable`，除非先确认它在无 Contena Admin SDK 宿主时可以独立工作；本 Demo 默认使用 `MtDataTable`。

## 10. 可访问性和响应式

- 所有可点击元素可通过键盘访问，焦点样式清晰。
- 图标按钮必须有 `aria-label` 和 `MtTooltip`。
- 表单标签不能只依赖 placeholder。
- 状态不能只依赖颜色，必须同时有文字。
- 抽屉和弹窗打开后焦点进入容器，关闭后返回触发按钮。
- 1440x900、1280x800、768x1024 和 390x844 下不能出现文字遮挡、横向页面溢出或控件重叠。
- 手机端表格允许自身水平滚动，但页面壳层不得整体横向滚动。
- 长中文标题要截断并提供 Tooltip；按钮文字不能挤出容器。

## 11. 测试和验收

### 11.1 必须通过的命令

从仓库根目录运行：

```bash
pnpm install
pnpm --filter admin-demo typecheck
pnpm --filter admin-demo test
pnpm --filter admin-demo build
pnpm --filter admin-demo test:e2e
```

### 11.2 Playwright 必测流程

1. 使用错误账号登录，看到错误 Banner。
2. 使用 `admin` / `meteor` 登录并进入工作台。
3. 展开、收起侧栏，刷新后状态正确。
4. 切换暗色和亮色主题。
5. 进入用户管理，搜索、筛选、排序和分页结果正确。
6. 选择多行并执行批量停用，再撤销或重新启用。
7. 新增用户、编辑用户、删除用户并看到 Snackbar。
8. 打开文章编辑抽屉，修改内容并保存。
9. 打开订单详情，金额和状态正确。
10. 在手机视口打开菜单和新增抽屉，无重叠和溢出。

### 11.3 视觉验收

- 使用 Playwright 截取 1440x900 的工作台、用户列表、用户编辑抽屉和系统设置。
- 使用 390x844 截取登录页、移动菜单和用户编辑抽屉。
- 检查截图不是空白，页面主内容完整，侧栏和顶栏对齐。
- 检查浏览器控制台无 error。
- 检查所有引用图标均实际渲染，不能出现空白图标占位。

## 12. 完成标准

只有同时满足以下条件才算完成：

- 所有路由均可访问且没有死菜单。
- 所有页面都使用 Meteor 组件，没有混入其他 UI 库。
- 登录、筛选、排序、分页、列设置、批量操作、CRUD、主题和退出均可操作。
- 假数据有足够规模，能够真实检验表格和布局密度。
- 生产构建、类型检查、单元测试和 Playwright 全部通过。
- 桌面端和移动端截图验证通过。
- 没有 console error、未处理 Promise、明显布局跳动或重叠。
- 没有把按钮留成 `console.log`、空事件或“敬请期待”。
- README 增加最终运行方式、测试方式、测试账号和已知 Meteor 能力缺口。

## 13. AI 执行顺序

实现 AI 按以下顺序工作，不要在只完成首页后停止：

1. 阅读仓库 `AGENTS.md`、本规格、现有 `examples/nuxt-app` 和相关 Meteor Storybook 源码。
2. 建立 Nuxt 工程、i18n、Meteor 样式、主题和测试基础设施。
3. 完成登录、路由守卫和响应式后台壳层。
4. 建立固定假数据、repository composable 和通用抽屉。
5. 完成工作台和通用列表交互基准。
6. 按菜单顺序完成每个模块，不创建无内容占位页。
7. 补齐 loading、empty、error、确认和 Snackbar 状态。
8. 完成单元测试、Playwright 和响应式截图检查。
9. 运行全部验收命令，修复失败后再交付。

当 Meteor 组件 API 与本规格描述不一致时，以当前仓库源码为准；但不得因此换用其他 UI 库。真实缺口应使用最小的项目级布局组合解决，并在最终 README 中记录原因。

## 14. 运行与验收

从仓库根目录安装依赖并启动 Demo：

```bash
pnpm install
pnpm --filter admin-demo dev
```

默认访问地址为 `http://127.0.0.1:3100`。测试账号：用户名 `admin`，密码 `meteor`。

完整验收命令：

```bash
pnpm --filter admin-demo typecheck
pnpm --filter admin-demo test
NUXT_IGNORE_LOCK=1 pnpm --filter admin-demo build
pnpm --filter admin-demo test:e2e
```

登录态根据“保持登录”选项写入 `localStorage` 或 `sessionStorage`。主题、侧栏展开状态、菜单分组状态和表格列配置写入 `localStorage`；业务假数据在当前页面会话中保持一致，刷新页面后恢复固定初始数据，保证演示和自动化测试结果稳定。

## 15. Meteor 能力边界

- Meteor 当前没有抽屉组件，因此 Demo 使用项目级 `AdminDrawer` 组合布局；抽屉内的按钮、表单和 Tabs 仍全部使用 Meteor 组件。
- `MtTabs` 依赖组件库的设备信息注入，Demo 通过客户端插件注册 `DeviceHelperPlugin`。
- `MtDataTable` 内部仍通过已弃用的 `MtCheckbox.checked` 属性驱动选择状态，开发环境会输出弃用警告；Demo 不修改组件库源码。
- 组件库发布包缺少一份 CSS source map，Vitest 会输出非阻塞警告，不影响样式加载和测试结果。
- 生产构建会提示部分客户端包体较大；当前 Demo 保留组件库的工作区构建方式，没有在示例内复制或拆改组件源码。
