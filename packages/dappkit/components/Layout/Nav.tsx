"use client";

import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { HeaderStore } from "../../module/Layout/header";
import { RootStore } from "../../store/root";
import { Logo } from "./Logo";
import { SlotPlugin } from "../../module/Core/Slot";

const Nav = observer(() => {
  const header = RootStore.Get(HeaderStore);
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 w-full">
        <SlotPlugin.Slot name={HeaderStore.slots.Logo.name} />
        <SlotPlugin.Slot name={HeaderStore.slots.MobileNav.name} className="md:hidden" />
        <SlotPlugin.Slot name={HeaderStore.slots.DesktopNav.name} className="mx-6 hidden md:block" />
      </div>
    </div>
  );
});

export default Nav;
