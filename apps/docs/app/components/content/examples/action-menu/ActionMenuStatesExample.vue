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
          <mt-action-menu-item disabled icon="copy">Copy</mt-action-menu-item>
          <mt-action-menu-item disabled>Rename</mt-action-menu-item>
        </mt-action-menu-group>

        <mt-action-menu-group>
          <mt-action-menu-item icon="trash" variant="critical">
            Delete
          </mt-action-menu-item>
          <mt-action-menu-item disabled variant="critical">
            Remove
          </mt-action-menu-item>
        </mt-action-menu-group>
      </mt-action-menu>
    </mt-dropdown-menu-portal>
  </mt-dropdown-menu-root>
</template>
