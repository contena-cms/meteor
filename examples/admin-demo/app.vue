<template>
  <MtThemeProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <MtSnackbar />
  </MtThemeProvider>
</template>

<script setup lang="ts">
import { MtSnackbar, MtThemeProvider, useTheme } from "@contena/meteor-component-library";

useTheme({ storageKey: "admin-demo-theme", defaultTheme: "light" });
</script>
