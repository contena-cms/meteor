<script setup lang="ts">
import { ref } from "vue";
import MtPasswordField from "@contena/meteor-component-library/MtPasswordField";

const password = ref("");
</script>

<template>
  <mt-password-field v-model="password" label="Password" />
</template>
