# Contena Service Permissions

This private SDK API is available to Contena Services through the `_private` namespace.

## `grant()`

```ts
import { _private } from '@contena/meteor-admin-sdk';

await _private.permissions.grant();
```

Grants the current Contena Services consent. The Administration resolves the current permissions revision and grants it through the platform service. The revision is intentionally not supplied by the service, so the grant scope stays platform-controlled.

This grants the **global Contena Services consent** (applies to all services), not a per-service grant.

## `isGranted()`

```ts
import { _private } from '@contena/meteor-admin-sdk';

const granted = await _private.permissions.isGranted(): Promise<boolean>;
```

Resolves to `true` when the grant UI can stay hidden — i.e. consent for the latest revision is in place, or Contena Services are disabled. Resolves to `false` when Contena Services are enabled and the latest consent revision has not been granted yet. Combine with `_private.context.isService()` (render the banner when `isService() && !isGranted()`).
