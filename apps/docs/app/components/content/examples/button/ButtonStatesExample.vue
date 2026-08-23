<script setup lang="ts">
import MtButton from "@contena/meteor-component-library/MtButton";
</script>

<template>
  <mt-button>Default</mt-button>
  <mt-button :disabled="true">Disabled</mt-button>
  <mt-button :is-loading="true">Loading</mt-button>
</template>
