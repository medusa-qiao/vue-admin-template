<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobal, useWatermark } from "@pureadmin/utils";
import { ReDialog, closeAllDialog } from "@/components/ReDialog";
import { ReDrawer, closeAllDrawer } from "@/components/ReDrawer";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";

defineOptions({ name: "App" });

const route = useRoute();
const router = useRouter();
const { $storage } = useGlobal<GlobalPropertiesApi>();
const { setWatermark, clear } = useWatermark();
const currentLocale = computed(() =>
  $storage.locale?.locale === "en" ? en : zhCn
);

const removeGuard = router.beforeEach(() => {
  closeAllDialog();
  closeAllDrawer();
});

watch(
  [
    () => $storage.configure?.watermark,
    () => $storage.configure?.watermarkText,
    () => route.name
  ],
  async ([enabled, text, name]) => {
    await nextTick();
    if (enabled && name !== "Login") {
      setWatermark(text, { verticalOffset: 170 });
    } else {
      clear();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  removeGuard();
  clear();
});
</script>

<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <ReDrawer />
  </el-config-provider>
</template>
