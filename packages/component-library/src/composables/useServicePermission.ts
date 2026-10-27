import { can, compareIsContenaVersion } from "@contena-ag/meteor-admin-sdk/es/context";
import { isService as checkIsService } from "@contena-ag/meteor-admin-sdk/es/_private/context";
import {
  grant as grantPermission,
  isGranted,
} from "@contena-ag/meteor-admin-sdk/es/_private/permissions";
import { routerPush } from "@contena-ag/meteor-admin-sdk/es/window";
import { asyncComputed } from "@vueuse/core";
import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

const contenaServicePagePath = "/sw/settings/services/index";

export interface UseServicePermissionReturn {
  /** Whether the current Contena version predates native service permissions. */
  isLegacySWVersion: Ref<boolean | null>;
  /** Whether the Contena version check is still running. */
  isLegacySWVersionEvaluating: Ref<boolean>;
  /** Whether a native service permission request is currently running. */
  isGranting: Ref<boolean>;
  /** Whether the current extension is running as a Contena Service. */
  isService: Ref<boolean>;
  /** Whether the required permission is granted, or `null` when it cannot be resolved. */
  permissionGranted: Ref<boolean | null>;
  /** Whether permission-related UI should be displayed. */
  isShowPermissionUI: ComputedRef<boolean>;
  /** Grants native service permissions or opens the Services page on legacy Contena versions. */
  grant: () => Promise<void>;
}

/** Resolves and grants permissions required by a Contena Service. */
export function useServicePermission(): UseServicePermissionReturn {
  const isGranting = ref(false);
  const isLegacySWVersionEvaluating = ref(true);

  const isLegacySWVersion = asyncComputed<boolean | null>(
    async () => {
      try {
        return await compareIsContenaVersion("<", "6.7.14.0");
      } catch {
        return null;
      }
    },
    null,
    { evaluating: isLegacySWVersionEvaluating },
  );

  const isService = asyncComputed(async () => {
    if (
      isLegacySWVersionEvaluating.value ||
      isLegacySWVersion.value === null ||
      isLegacySWVersion.value
    ) {
      return false;
    }

    return await checkIsService();
  }, false);

  const permissionGranted = asyncComputed<boolean | null>(async () => {
    if (isLegacySWVersionEvaluating.value || isLegacySWVersion.value === null) {
      return null;
    }

    try {
      if (isLegacySWVersion.value) {
        // Legacy Administrations expose the Contena Services consent through
        // the system configuration privilege because the dedicated service
        // permission API is only available from Contena 6.7.14.0 onwards.
        return await can("system_config:read");
      }

      return await isGranted();
    } catch {
      return null;
    }
  }, null);

  const isShowPermissionUI = computed(() => {
    if (
      isLegacySWVersionEvaluating.value ||
      isLegacySWVersion.value === null ||
      permissionGranted.value === null
    ) {
      return false;
    }

    if (isLegacySWVersion.value) {
      return !permissionGranted.value;
    }

    return isService.value && !permissionGranted.value;
  });

  async function grant(): Promise<void> {
    if (isLegacySWVersionEvaluating.value) return;

    if (isLegacySWVersion.value === null) return;

    if (isLegacySWVersion.value) {
      try {
        await routerPush({ path: contenaServicePagePath });
      } catch (error) {
        console.error("Error granting permission:", error);
        throw error;
      }

      return;
    }

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
    isLegacySWVersion,
    isLegacySWVersionEvaluating,
    isGranting,
    isService,
    permissionGranted,
    isShowPermissionUI,
    grant,
  };
}
