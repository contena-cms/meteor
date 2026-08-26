import * as ct from '../../src/index';
import { handle, publish, send, setExtensions } from '../../src/channel';
import Criteria from '../../src/data/Criteria';
import EntityCollection from "../../src/_internals/data/EntityCollection";
import EntityClass from "../../src/_internals/data/Entity";
import MissingPrivilegesError from '../../src/_internals/privileges/missing-privileges-error';
export interface ct_internal {
  handle: typeof handle,
  publish: typeof publish,
  send: typeof send,
  setExtensions: typeof setExtensions,
  Criteria: typeof Criteria,
  Collection: typeof EntityCollection,
  MissingPrivilegesError: typeof MissingPrivilegesError
  Entity: typeof EntityClass,
}

declare global {
  interface Window {
    ct: typeof ct;
    ct_internal: ct_internal
  }
}

window.ct = ct;
window.ct_internal = {
  handle: handle,
  publish: publish,
  send: send,
  setExtensions: setExtensions,
  Criteria: Criteria,
  Collection: EntityCollection,
  Entity: EntityClass,
  MissingPrivilegesError: MissingPrivilegesError,
}


window.ct_internal.setExtensions({
  example: {
    baseUrl: 'http://localhost:8182',
    permissions: {
      create: ['test', 'foo', 'product'],
      update: ['test', 'foo', 'product'],
      delete: ['test', 'foo', 'product'],
      read: ['test', 'foo', 'product'],
    }
  },
});
