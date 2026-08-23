<script setup lang="ts">
import { ref } from "vue";
import MtUrlField from "@contena/meteor-component-library/MtUrlField";

const url = ref("https://contena.cn");
</script>

<template>
  <mt-url-field v-model="url" label="Website" />
</template>
