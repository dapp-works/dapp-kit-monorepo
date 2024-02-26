"use client";

import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { cn } from "../../lib/utils";
import { HeaderStore } from "../../module/Layout/header";
import RootStore from "../../store/root";
import { StoragePlugin } from "../../module/Core/Storage";
import { SlotPlugin } from "../../module/Core/Slot";
import ErrorBoundary from "../Common/ErrorBoundary";

export const DesktopNav = observer(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const header = RootStore.Get(HeaderStore);
    return (
      <>
        <nav
          className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
          {header.navs.value?.map?.((item, index) => {
            return (
              <Link
                href={item.href ?? '/'}
                key={index}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {item.text}
              </Link>
            );
          })}
        </nav>
        {/* <header.UserNav className="ml-auto hidden md:flex" /> */}
        <SlotPlugin.Slot name={HeaderStore.slots.UserNav.name} className="ml-auto hidden md:flex" />
      </>
    );
  },
);
