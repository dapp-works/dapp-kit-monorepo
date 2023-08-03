import { Store } from '@/dappkit/store/standard/base';
import { PromiseState } from '@/dappkit/store/standard/PromiseState';
import { StoragePlugin } from '../Core/Storage';
import { Logo } from '@/dappkit/components/Layout/Logo';
import { MainNav } from '@/dappkit/components/Layout/MainNav';
import { UserNav } from '@/dappkit/components/Layout/UserNav';
import Nav from '@/dappkit/components/Layout/Nav';

export class HeaderStore implements Store {
  sid = 'HeaderStore';
  autoAsyncable?: boolean = true;
  autoObservable?: boolean = true;
  
  get Header() {
    return Nav;
  }

  Logo = (props) => {
    return <Logo {...props} />;
  };

  MainNav = (props) => {
    return <MainNav {...props} />;
  };

  UserNav = (props) => {
    return <UserNav {...props} />;
  };

  get navs() {
    return StoragePlugin.Get({
      key: 'navs',
      value: [
        { text: 'Home', href: '/' },
        { text: 'Depin Projects', href: '/depin' },
        { text: 'Discover', href: '/browse/dashboards' },
      ],
      engine: StoragePlugin.engines.asyncStorage,
    });
  }

  toJSON() {
    return {
      nav: this.navs,
    };
  }
  set(args: Partial<HeaderStore>) {
    Object.assign(this, args);
  }

  test = new PromiseState({
    debug: {
      name: 'test',
      input: { username: '', password: '' },
    },
    function: async (input: { username: string; password: string }) => {
      console.log(input);
    },
  });
  test1 = new PromiseState({
    debug: {
      name: 'test1',
      input: { username: '', password: '' },
    },
    function: async (input: { username: string; password: string }) => {
      console.log(input);
    },
  });

  constructor(args: Partial<HeaderStore> = {}) {
    Object.assign(this, args);
  }
}
