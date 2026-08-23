<script setup lang="ts">
import MtModalRoot from "@contena/meteor-component-library/MtModalRoot";
import MtModal from "@contena/meteor-component-library/MtModal";
import MtModalTrigger from "@contena/meteor-component-library/MtModalTrigger";
import MtModalClose from "@contena/meteor-component-library/MtModalClose";
import MtButton from "@contena/meteor-component-library/MtButton";
</script>

<template>
  <mt-modal-root>
    <mt-modal-trigger :as="MtButton">Open modal</mt-modal-trigger>

    <mt-modal title="Modal Title">
      <template #default>Modal content</template>

      <template #footer>
        <div style="display: flex; justify-content: flex-end">
          <mt-modal-close :as="MtButton" variant="secondary">Close</mt-modal-close>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>
