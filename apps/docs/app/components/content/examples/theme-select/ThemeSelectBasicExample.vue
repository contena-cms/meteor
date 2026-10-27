<script setup lang="ts">
import { ref } from "vue";
import MtThemeSelect from "@contena-ag/meteor-component-library/MtThemeSelect";
import type { Theme } from "@contena-ag/meteor-component-library";

const theme = ref<Theme>("system");
</script>

<template>
  <mt-theme-select v-model="theme" label="Color theme" />
</template>
