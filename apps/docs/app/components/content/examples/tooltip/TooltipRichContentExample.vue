<script setup lang="ts">
import MtTooltip from "@contena/meteor-component-library/MtTooltip";
import MtButton from "@contena/meteor-component-library/MtButton";
</script>

<template>
  <mt-tooltip
    content="<strong>Tooltip title: </strong>Use short supporting details."
    :max-width="240"
  >
    <template #default="params">
      <mt-button variant="secondary" v-bind="params">Open tooltip</mt-button>
    </template>
  </mt-tooltip>
</template>
