<script setup lang="ts">
import MtCollapsible from "@contena/meteor-component-library/MtCollapsible";
import MtCollapsibleTrigger from "@contena/meteor-component-library/MtCollapsibleTrigger";
import MtCollapsibleContent from "@contena/meteor-component-library/MtCollapsibleContent";
import MtButton from "@contena/meteor-component-library/MtButton";
</script>

<template>
  <mt-collapsible disabled>
    <mt-collapsible-trigger as-child>
      <mt-button variant="primary" disabled>Toggle content</mt-button>
    </mt-collapsible-trigger>

    <mt-collapsible-content>
      <p style="margin-top: 8px; font-size: var(--font-size-xs);">
        This content cannot be toggled because the collapsible is disabled.
      </p>
    </mt-collapsible-content>
  </mt-collapsible>
</template>
