import { Store } from '@/dappkit/store/standard/base';
import { NextRouter, useRouter } from 'next/router';

export class RouterStore implements Store {
  sid = 'RouterStore';
  autoObservable?: boolean = true;

  router: NextRouter = null;

  use() {
    const router = useRouter();
    this.router = router;
  }
  constructor(args: Partial<RouterStore> = {}) {
    Object.assign(this, args);
  }
}
