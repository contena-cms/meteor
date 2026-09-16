<script setup lang="ts">
import MtBreadcrumb from "@contena/meteor-component-library/MtBreadcrumb";

const items = [
  { label: "Home", to: "#" },
  { label: "Products", to: "#" },
  { label: "Shoes" },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <mt-breadcrumb :items="items" size="xs" />
    <mt-breadcrumb :items="items" size="s" />
  </div>
</template>
