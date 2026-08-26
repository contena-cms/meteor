import { createSender } from '../../channel';

/**
 * Grant the permissions required by Contena Services.
 *
 * @private
 */
export const grant = createSender('servicePermissionGrant', {});

/**
 * Check whether the Contena Services consent is already granted (or not needed).
 * Resolves to `true` when the grant UI can stay hidden — i.e. the latest revision
 * has been consented to, or Contena Services are disabled.
 *
 * @private
 */
export const isGranted = createSender('servicePermissionIsGranted', {});

export type servicePermissionGrant = {
  responseType: void,
}

export type servicePermissionIsGranted = {
  responseType: boolean,
}
