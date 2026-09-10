---
title: useServicePermission
description: Manages Contena Services consent and permission state for service extensions.
---

## Usage

`useServicePermission` resolves whether the current extension is a Contena Service and whether the required Contena Services consent has been granted. Use it when building a custom permission UI.

```ts
import { useServicePermission } from "@contena/meteor-component-library";

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
| `isGranting` | `Ref<boolean>` | Whether a permission request is currently running. |
| `isService` | `Ref<boolean \| null>` | Whether the current extension is running as a Contena Service. `null` means the state could not be resolved. |
| `permissionGranted` | `Ref<boolean \| null>` | Whether Contena Services consent is granted. `null` means the state could not be resolved. |
| `isShowPermissionUI` | `ComputedRef<boolean>` | Whether permission UI should be shown. |
| `grant` | `() => Promise<void>` | Requests Contena Services consent. Rejects when the grant flow fails. |

## Behavior

- Consent is resolved and requested through the native service-permission API.
- `grant()` rejects after logging an error, so callers can show their own error state or emit an error event.
- The permission UI should only be rendered when `isShowPermissionUI.value` is `true`.
