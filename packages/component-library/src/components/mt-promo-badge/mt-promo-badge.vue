<template>
  <span class="mt-promo-badge" :style="{ '--mt-promo-badge-icon-color': iconColor }">
    <mt-badge :variant="badgeVariant" :size="size" :icon="badgeIcon">
      {{ promoText }}
    </mt-badge>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MtBadge from "../mt-badge/mt-badge.vue";

const props = withDefaults(
  defineProps<{
    variant?: "new" | "beta" | "contena-ai";
    size?: "s" | "m" | "l";
  }>(),
  {
    variant: "new",
    size: "s",
  },
);

const { t } = useI18n({
  messages: {
    en: {
      "mt-promo-badge": {
        new: "New",
        beta: "Beta",
        contenaAi: "Contena AI",
      },
    },
    zh: {
      "mt-promo-badge": {
        new: "新",
        beta: "Beta",
        contenaAi: "Contena AI",
      },
    },
  },
});

const size = computed(() => {
  const n = String(props.size ?? "s").toLowerCase();
  return n === "s" ? "s" : n === "m" ? "m" : n === "l" ? "l" : "s";
});

const badgeVariant = computed(() =>
  props.variant === "contena-ai" ? "neutral" : props.variant === "beta" ? "info" : "positive",
);

const promoText = computed(() =>
  props.variant === "contena-ai"
    ? t("mt-promo-badge.contenaAi")
    : props.variant === "new"
      ? t("mt-promo-badge.new")
      : t("mt-promo-badge.beta"),
);

const badgeIcon = computed(() =>
  props.variant === "beta"
    ? "solid-code"
    : props.variant === "contena-ai"
      ? "solid-sparkles"
      : "solid-party-horn",
);

const iconColor = computed(() =>
  props.variant === "contena-ai"
    ? "var(--color-icon-brand-default)"
    : "var(--color-icon-primary-default)",
);
</script>

<style scoped>
.mt-promo-badge :deep(.mt-icon) {
  color: var(--mt-promo-badge-icon-color);
}
</style>
