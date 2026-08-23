<script setup lang="ts">
import { ref } from "vue";
import MtEmailField from "@contena/meteor-component-library/MtEmailField";

const value = ref("");
</script>

<template>
  <mt-email-field v-model="value" label="Email address" placeholder="name@example.com">
    <template #hint>We never share your email.</template>
  </mt-email-field>
</template>
