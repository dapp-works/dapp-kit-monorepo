import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { HeaderStore } from "../../module/Layout/header";
import RootStore from "../../store/root";
import { Logo } from "./Logo";

const Nav = observer(() => {
  const header = RootStore.Get(HeaderStore);
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 w-full">
        <header.Logo />
        <header.MobileNav className="md:hidden" />
        <header.DesktopNav className="mx-6 hidden md:block" />
      </div>
    </div>
  );
});

export default Nav;
