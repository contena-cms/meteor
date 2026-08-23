<script setup lang="ts">
import { ref } from "vue";
import MtThemeSelect from "@contena/meteor-component-library/MtThemeSelect";
import type { Theme } from "@contena/meteor-component-library";

const theme = ref<Theme>("system");
</script>

<template>
  <mt-theme-select v-model="theme" label="Color theme" />
</template>
