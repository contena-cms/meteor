<template>
  <main class="login-page">
    <section class="login-panel" aria-labelledby="login-title">
      <div class="login-brand"><div class="login-mark">星</div><span>星云内容中台</span></div>
      <div class="login-heading"><h1 id="login-title">登录管理后台</h1><p>杭州云帆科技有限公司</p></div>
      <MtBanner v-if="error" variant="critical" title="登录失败">用户名或密码错误，请使用测试账号重试。</MtBanner>
      <form @submit.prevent="submit">
        <MtTextField v-model="username" label="用户名" autocomplete="username" required />
        <MtPasswordField v-model="password" label="密码" autocomplete="current-password" required />
        <MtCheckbox v-model="remember" label="保持登录" />
        <MtButton type="submit" variant="primary" :is-loading="loading" :disabled="loading">登录</MtButton>
      </form>
      <p class="login-hint">测试账号 admin / meteor</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { MtBanner, MtButton, MtCheckbox, MtPasswordField, MtTextField } from "@contena/meteor-component-library";
definePageMeta({ layout: false });
const username = ref(""); const password = ref(""); const remember = ref(true); const error = ref(false); const loading = ref(false);
const { login } = useAuth();
async function submit() { error.value = false; loading.value = true; const ok = await login(username.value, password.value, remember.value); loading.value = false; if (!ok) { error.value = true; return; } await navigateTo("/dashboard"); }
</script>

<style scoped lang="scss">
.login-page { min-height: 100vh; display: grid; place-items: center; padding: var(--scale-size-20); background: var(--color-elevation-surface-sunken); }
.login-panel { width: min(420px, 100%); padding: var(--scale-size-32); border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-m); background: var(--color-elevation-surface-default); box-shadow: 0 12px 36px var(--color-elevation-shadow-default); }
.login-brand { display: flex; align-items: center; gap: var(--scale-size-10); font-weight: var(--font-weight-bold); }
.login-mark { width: 36px; height: 36px; display: grid; place-items: center; border-radius: var(--border-radius-s); color: var(--color-text-static-default); background: var(--color-interaction-primary-default); }
.login-heading { margin: var(--scale-size-28) 0 var(--scale-size-20); }
.login-heading h1 { margin: 0 0 var(--scale-size-6); font-size: var(--font-size-xl); }
.login-heading p, .login-hint { margin: 0; color: var(--color-text-secondary-default); font-size: var(--font-size-xs); }
form { display: grid; gap: var(--scale-size-16); margin-top: var(--scale-size-16); }
form :deep(.mt-button) { width: 100%; justify-content: center; }
.login-hint { margin-top: var(--scale-size-16); text-align: center; }
@media (max-width: 480px) { .login-page { padding: var(--scale-size-12); } .login-panel { padding: var(--scale-size-24) var(--scale-size-20); } }
</style>
