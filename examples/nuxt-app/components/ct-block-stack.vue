<template>
  <div class="ct-block-stack">
    <slot />
  </div>
</template>

<style scoped>
.ct-block-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
</style>
