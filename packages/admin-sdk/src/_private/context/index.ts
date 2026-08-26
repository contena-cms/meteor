import { createSender } from '../../channel';

/**
 * Check whether the current extension is a Contena Service.
 *
 * @private
 */
export const isService = createSender('contextIsService', {});

export type contextIsService = {
  responseType: boolean,
}
