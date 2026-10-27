---
title: useServicePermission
description: Manages Contena Services consent and permission state for service extensions.
---

## Usage

`useServicePermission` resolves whether the current extension is a Contena Service and whether the required Contena Services consent has been granted. Use it when building a custom permission UI.

```ts
import { useServicePermission } from "@contena-ag/meteor-component-library";

const {
  isService,
  permissionGranted,
  isShowPermissionUI,
  grant,
} = useServicePermission();

if (isShowPermissionUI.value) {
  await grant();
}
```

## API

`useServicePermission()` returns:

| Member | Type | Description |
| --- | --- | --- |
| `isLegacySWVersion` | `Ref<boolean \| null>` | Whether the Administration predates the native service-permission API. `null` means the version could not be resolved. |
| `isLegacySWVersionEvaluating` | `Ref<boolean>` | Whether the Administration version check is still running. |
| `isGranting` | `Ref<boolean>` | Whether a native permission request is currently running. |
| `isService` | `Ref<boolean>` | Whether the current extension is running as a Contena Service. |
| `permissionGranted` | `Ref<boolean \| null>` | Whether Contena Services consent is granted. `null` means the state could not be resolved. |
| `isShowPermissionUI` | `ComputedRef<boolean>` | Whether permission UI should be shown. |
| `grant` | `() => Promise<void>` | Requests Contena Services consent or opens the Services settings page on legacy Administrations. Rejects when the grant flow fails. |

## Behavior

- On Contena 6.7.14.0 and later, consent is resolved and requested through the native service-permission API.
- On older Administrations, `system_config:read` is used as the legacy signal for Contena Services consent, and `grant()` opens the Services settings page.
- `grant()` rejects after logging an error, so callers can show their own error state or emit an error event.
- The permission UI should only be rendered when `isShowPermissionUI.value` is `true`.
