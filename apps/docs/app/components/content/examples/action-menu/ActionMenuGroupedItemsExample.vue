<script setup lang="ts">
import {
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtDropdownMenuPortal,
} from "@contena/meteor-component-library";
import MtButton from "@contena/meteor-component-library/MtButton";
import MtActionMenu from "@contena/meteor-component-library/MtActionMenu";
import MtActionMenuItem from "@contena/meteor-component-library/MtActionMenuItem";
import MtActionMenuGroup from "@contena/meteor-component-library/MtActionMenuGroup";
</script>

<template>
  <mt-dropdown-menu-root>
    <mt-dropdown-menu-trigger as-child>
      <mt-button>Open menu</mt-button>
    </mt-dropdown-menu-trigger>

    <mt-dropdown-menu-portal>
      <mt-action-menu>
        <mt-action-menu-group>
          <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
          <mt-action-menu-item icon="solid-duplicate">Duplicate</mt-action-menu-item>
        </mt-action-menu-group>

        <mt-action-menu-group>
          <mt-action-menu-item icon="cog">Settings</mt-action-menu-item>
          <mt-action-menu-item icon="user">Profile</mt-action-menu-item>
        </mt-action-menu-group>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
