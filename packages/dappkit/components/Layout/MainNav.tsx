import Link from 'next/link';

import { cn } from '../../lib/utils';
import React from 'react';
import { observer } from 'mobx-react-lite';
import RootStore from '@/dappkit/store/root';
import { NavStore } from '@/dappkit/module/Layout/nav';

export const MainNav = observer(({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const nav = RootStore.Get(NavStore);
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {nav?.navs?.map((item, index) => {
        return (
          <Link href={item.href} key={index} className="text-sm font-medium transition-colors hover:text-primary">
            {item.text}
          </Link>
        );
      })}
    </nav>
  );
});
