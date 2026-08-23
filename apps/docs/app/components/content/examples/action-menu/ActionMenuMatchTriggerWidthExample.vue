<script setup lang="ts">
import {
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtDropdownMenuPortal,
} from "@contena/meteor-component-library";
import MtButton from "@contena/meteor-component-library/MtButton";
import MtActionMenu from "@contena/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@contena/meteor-component-library/MtActionMenuItem";
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <mt-button style="width: 260px;">Project actions</mt-button>
    </mt-dropdown-menu-trigger>

    <mt-dropdown-menu-portal>
      <mt-action-menu match-trigger-width>
        <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
        <mt-action-menu-item icon="solid-duplicate">Duplicate</mt-action-menu-item>
        <mt-action-menu-item icon="trash" variant="critical">Delete</mt-action-menu-item>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
