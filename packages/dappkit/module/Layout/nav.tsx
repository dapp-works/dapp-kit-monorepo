import { Store } from '@/dappkit/store/standard/base';

type Nav = { text: string; href: string };
type UserNav = { text: string; href?: string; onClick?: () => void };

export class NavStore implements Store {
  sid = 'NavStore';
  autoObservable?: boolean = true;
  autoAsyncable?: boolean = true;

  navs: Nav[] = [
    { text: 'Home', href: '/' },
    { text: 'Playgorund', href: '/playgorund' },
    { text: 'Settings', href: '/settings' },
  ];
  userNavs: UserNav[] = [
    {
      text: 'Profile',
      href: '/profile',
      onClick: () => {},
    },
    {
      text: 'Settings',
      href: '/settings',
      onClick: () => {},
    },
  ];

  constructor(args: Partial<NavStore> = {}) {
    Object.assign(this, args);
  }
}
