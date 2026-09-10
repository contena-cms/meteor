import { isService as checkIsService } from "@contena/meteor-admin-sdk/es/_private/context";
import {
  grant as grantPermission,
  isGranted,
} from "@contena/meteor-admin-sdk/es/_private/permissions";
import { asyncComputed } from "@vueuse/core";
import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

export interface UseServicePermissionReturn {
  /** Whether a service permission request is currently running. */
  isGranting: Ref<boolean>;
  /** Whether the current extension is running as a Contena Service. */
  isService: Ref<boolean | null>;
  /** Whether the required permission is granted, or `null` when it cannot be resolved. */
  permissionGranted: Ref<boolean | null>;
  /** Whether permission-related UI should be displayed. */
  isShowPermissionUI: ComputedRef<boolean>;
  /** Grants the permissions required by the current Contena Service. */
  grant: () => Promise<void>;
}

/** Resolves and grants permissions required by a Contena Service. */
export function useServicePermission(): UseServicePermissionReturn {
  const isGranting = ref(false);

  const isService = asyncComputed<boolean | null>(async () => {
    try {
      return await checkIsService();
    } catch {
      return null;
    }
  }, null);

  const permissionGranted = asyncComputed<boolean | null>(async () => {
    try {
      return await isGranted();
    } catch {
      return null;
    }
  }, null);

  const isShowPermissionUI = computed(
    () => isService.value === true && permissionGranted.value === false,
  );

  async function grant(): Promise<void> {
    if (isGranting.value) return;

    isGranting.value = true;

    try {
      await grantPermission();
    } catch (error) {
      console.error("Error granting permission:", error);
      throw error;
    } finally {
      isGranting.value = false;
    }
  }

  return {
    isGranting,
    isService,
    permissionGranted,
    isShowPermissionUI,
    grant,
  };
}
