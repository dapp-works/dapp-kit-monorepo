import { observer } from 'mobx-react-lite';
import { HeaderStore } from '../../module/Layout/header';
import { useState } from 'react';
import React from 'react';
import { MainNav } from './MainNav';
import { Input } from '../ui/input';
import { Logo } from './Logo';
import RootStore from '@/dappkit/store/root';

const Nav = observer(() => {
  const header = RootStore.Get(HeaderStore);
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <header.Logo />
        <header.MainNav className="mx-6" />
        <header.UserNav className="ml-auto" />
      </div>
    </div>
  );
});

export default Nav;
