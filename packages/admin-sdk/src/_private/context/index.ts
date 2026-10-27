import { createSender } from '../../channel';
import { compareIsContenaVersion } from '../../context';

const getServiceContext = createSender('contextIsService', {});

/**
 * Check whether the current extension is a Contena Service.
 *
 * @private
 * @since 6.7.14.0
 */
export async function isService(): Promise<boolean> {
  if (await compareIsContenaVersion('<', '6.7.14.0')) {
    throw new Error('isService() requires Contena 6.7.14.0 or newer');
  }

  return (await getServiceContext()) ?? false;
}

export type contextIsService = {
  responseType: boolean,
}
