<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineOptions({ name: "Welcome" });

const { t } = useI18n();
</script>

<template>
  <el-card shadow="never">
    <h1 class="mb-3 text-xl font-medium">{{ t("starter.welcomeTitle") }}</h1>
    <p class="text-(--el-text-color-secondary)">
      {{ t("starter.welcomeDescription") }}
    </p>
  </el-card>
</template>
