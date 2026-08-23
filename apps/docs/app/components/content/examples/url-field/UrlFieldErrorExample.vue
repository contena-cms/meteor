<script setup lang="ts">
import { ref } from "vue";
import MtUrlField from "@contena/meteor-component-library/MtUrlField";

const value = ref("");
</script>

<template>
  <mt-url-field
    v-model="value"
    label="Website"
    placeholder="https://example.com"
    :error="{ detail: 'Enter a valid URL.' }"
  />
</template>
