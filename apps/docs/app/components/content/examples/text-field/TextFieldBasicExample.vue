<script setup lang="ts">
import { ref } from "vue";
import MtTextField from "@contena/meteor-component-library/MtTextField";

const value = ref("");
</script>

<template>
  <mt-text-field v-model="value" label="Text field label" />
</template>
