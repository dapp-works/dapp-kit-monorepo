import RootStore from '@/dappkit/store/root';
import { Store } from '@/dappkit/store/standard/base';

export class TemplateStore implements Store {
  sid = 'TemplateStore';
  autoObservable?: boolean = true;

  constructor(args: Partial<TemplateStore> = {}) {
    Object.assign(this, args);
  }
}
