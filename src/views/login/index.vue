<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { getConfig } from "@/config";
import { message } from "@/utils/message";
import { initRouter, getTopMenu } from "@/router/utils";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

defineOptions({ name: "Login" });

const { t } = useI18n();
const router = useRouter();
const { initStorage } = useLayout();
initStorage();
const { themeMode, dataThemeChange } = useDataThemeChange();
dataThemeChange(themeMode.value);

const formRef = ref<FormInstance>();
const submitting = ref(false);
const form = reactive({ username: "", password: "" });
const title = getConfig().Title;
const showDemoHint =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true";
const rules = computed<FormRules<typeof form>>(() => ({
  username: [
    { required: true, message: t("login.pureUsernameReg"), trigger: "blur" }
  ],
  password: [
    { required: true, message: t("login.purePassWordReg"), trigger: "blur" }
  ]
}));

async function onLogin() {
  if (!formRef.value || submitting.value) return;
  submitting.value = true;
  let authenticated = false;
  try {
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;
    await useUserStoreHook().loginByUsername({ ...form });
    authenticated = true;
    await initRouter();
    await router.replace(getTopMenu(true)?.path ?? "/welcome");
    message(t("login.pureLoginSuccess"), { type: "success" });
  } catch {
    if (authenticated) await useUserStoreHook().logOut();
    message(t("login.pureLoginFail"), { type: "error" });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-panel" aria-labelledby="login-title">
      <h1 id="login-title">{{ title }}</h1>
      <p class="login-description">{{ t("starter.loginDescription") }}</p>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @submit.prevent="onLogin"
      >
        <el-form-item :label="t('login.pureUsername')" prop="username">
          <el-input
            v-model.trim="form.username"
            name="username"
            autocomplete="username"
            :placeholder="t('login.pureUsernameReg')"
          />
        </el-form-item>
        <el-form-item :label="t('login.purePassword')" prop="password">
          <el-input
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            show-password
            :placeholder="t('login.purePassWordReg')"
          />
        </el-form-item>
        <el-button
          class="w-full"
          native-type="submit"
          type="primary"
          :loading="submitting"
        >
          {{ t("login.pureLogin") }}
        </el-button>
      </el-form>
      <p v-if="showDemoHint" class="demo-hint">{{ t("starter.demoHint") }}</p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  place-items: center;
}

.login-panel {
  width: 100%;
  max-width: 360px;
}

h1 {
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 600;
}

.login-description {
  margin-bottom: 32px;
  color: var(--el-text-color-secondary);
}

.demo-hint {
  margin-top: 20px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
