import { Store } from '@/dappkit/store/standard/base';

export class ConfigStore implements Store {
  sid = 'ConfigStore';
  autoObservable?: boolean = true;

  configs = {};

  constructor(args: Partial<ConfigStore> = {}) {
    Object.assign(this, args);
  }
}
