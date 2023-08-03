import { rootStore } from '@/store';
import { Store } from '@/dappkit/store/standard/base';
import { NextSeoProps } from 'next-seo';
import { RouterStore } from './Router';

export class PageStore implements Store {
  sid = 'PageStore';
  autoObservable?: boolean = true;
  autoAsyncable?: boolean = true;

  private PageType: {} & NextSeoProps;
  pages: Record<string, PageStore['PageType']> = {
    '/': {
      title: 'Home',
      description: 'Home page',
    },
  };

  get page() {
    const router = rootStore.get(RouterStore);
    const page = this.pages[router.router.pathname];
    return page;
  }

  constructor(args: Partial<PageStore> = {}) {
    Object.assign(this, args);
  }
}
