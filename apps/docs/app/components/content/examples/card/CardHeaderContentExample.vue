<script setup lang="ts">
import MtCard from "@contena/meteor-component-library/MtCard";
import MtAvatar from "@contena/meteor-component-library/MtAvatar";
import MtButton from "@contena/meteor-component-library/MtButton";
</script>

<template>
  <mt-card title="Customer details">
    <template #avatar>
      <mt-avatar first-name="Max" last-name="Mustermann" variant="square" />
    </template>

    <template #headerRight>
      <mt-button variant="secondary">Edit</mt-button>
    </template>

    <p>Use header content to add context and a related secondary action.</p>
  </mt-card>
</template>
