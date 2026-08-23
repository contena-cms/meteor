<script setup lang="ts">
import { ref } from "vue";
import MtPagination from "@contena/meteor-component-library/MtPagination";

const currentPage = ref(1);

function handlePageChange(page: number) {
  currentPage.value = page;
}
</script>

<template>
  <mt-pagination
    :current-page="currentPage"
    :limit="25"
    :total-items="100"
    @change-current-page="handlePageChange"
  />
</template>
