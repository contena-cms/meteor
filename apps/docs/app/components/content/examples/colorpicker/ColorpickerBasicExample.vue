<script setup lang="ts">
import { ref } from "vue";
import MtColorpicker from "@contena/meteor-component-library/MtColorpicker";

const value = ref("#0fcff5");
</script>

<template>
  <mt-colorpicker label="Colorpicker example" v-model="value" />
</template>
