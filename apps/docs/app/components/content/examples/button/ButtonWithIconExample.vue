<script setup lang="ts">
import MtButton from "@contena/meteor-component-library/MtButton";
import MtIcon from "@contena/meteor-component-library/MtIcon";
</script>

<template>
  <mt-button variant="secondary">
    <template #iconFront="{ size }">
      <mt-icon name="regular-plus-xs" :size="size" />
    </template>
    Add item
  </mt-button>
</template>
