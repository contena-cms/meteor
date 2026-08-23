<template>
  <mt-text
    v-if="!!error"
    as="span"
    size="xs"
    color="color-text-critical-default"
    class="mt-field__error"
  >
    <mt-icon name="solid-exclamation-circle" size="0.75rem" aria-hidden="true" />

    {{ errorMessage }}
  </mt-text>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  error?: Record<string, any> | null;
}>();

const errorMessage = computed(() => {
  if (!props.error) return "";

  if (!props.error.code) {
    return t(props.error?.detail ?? "");
  }

  // Try multiple translation namespaces with fallback
  const translationKeys = [
    `global.error-codes.${props.error.code}`,
    `mt-field-error.${props.error.code}`,
  ];
  const interpolationParams = {
    ...(props.error.meta?.parameters ?? {}),
    ...(props.error.parameters ?? {}),
  };

  for (const key of translationKeys) {
    const translation = t(key, interpolationParams);
    const noTranslationFound = translation === key;

    if (!noTranslationFound) {
      return translation;
    }
  }

  // Fallback to error detail if no translation found
  return props.error.detail;
});

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-field-error": {
        FRAMEWORK__MISSING_PRIVILEGE_ERROR: "Missing permissions",
        FRAMEWORK__DELETE_RESTRICTED: "Deletion failed",
        INVALID_MEDIA_URL: "Please enter a valid URL to upload a file.",
        CONTENT__MISSING_RULE_TYPE_EXCEPTION: "You must choose a type for this rule.",
        CONTENT__INVALID_CATEGORY_TYPE_AS_ENTRY_POINT:
          "The type can not be assigned while category is an entry point.",
        CONTENA_INVALID_IP: "Please enter a valid IP address.",
        INVALID_URL: "Please enter a valid url.",
        INVALID_MAIL: "Please enter a valid email address.",
        FRAMEWORK__RATE_LIMIT_EXCEEDED:
          "Too many requests. Please wait {seconds} seconds before trying again.",
        DUPLICATED_URL: "This URL is already in use. Please choose another URL.",
        "c1051bb4-d103-4f74-8988-acbcafc7fdc3": "This field must not be empty.",
      },
    },
    zh: {
      "mt-field-error": {
        FRAMEWORK__MISSING_PRIVILEGE_ERROR: "缺少所需权限。",
        FRAMEWORK__DELETE_RESTRICTED: "删除失败。",
        INVALID_MEDIA_URL: "请输入有效的文件 URL。",
        CONTENT__MISSING_RULE_TYPE_EXCEPTION: "请选择规则类型。",
        CONTENT__INVALID_CATEGORY_TYPE_AS_ENTRY_POINT: "分类作为入口时不能选择此类型。",
        CONTENA_INVALID_IP: "请输入有效的 IP 地址。",
        INVALID_URL: "请输入有效的 URL。",
        INVALID_MAIL: "请输入有效的邮箱地址。",
        FRAMEWORK__RATE_LIMIT_EXCEEDED: "请求次数过多，请等待 {seconds} 秒后重试。",
        DUPLICATED_URL: "此 URL 已被使用，请更换。",
        "c1051bb4-d103-4f74-8988-acbcafc7fdc3": "此字段不能为空。",
      },
    },
  },
});
</script>

<style scoped>
.mt-field__error {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
  margin-top: var(--scale-size-4);
  color: var(--color-icon-critical-default);
}
</style>
