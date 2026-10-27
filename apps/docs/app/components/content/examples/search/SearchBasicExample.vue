<script setup lang="ts">
import { ref } from "vue";
import MtSearch from "@contena-ag/meteor-component-library/MtSearch";

const term = ref("");
</script>

<template>
  <mt-search v-model="term" placeholder="Search" />
</template>
