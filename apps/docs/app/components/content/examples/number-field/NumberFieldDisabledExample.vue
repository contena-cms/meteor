<script setup lang="ts">
import MtNumberField from "@contena/meteor-component-library/MtNumberField";
</script>

<template>
  <mt-number-field label="Quantity" :step="1" number-type="int" disabled :model-value="42" />
</template>
