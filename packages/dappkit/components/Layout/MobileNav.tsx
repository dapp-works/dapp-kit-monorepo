"use client";
import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { cn } from "../../lib/utils";
import { HeaderStore } from "../../module/Layout/header";
import { NavStore } from "../../module/Layout/nav";
import RootStore from "../../store/root";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Button } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { StoragePlugin } from "../../module/Core/Storage";
import { SlotPlugin } from "../../module/Core/Slot";
import ErrorBoundary from "../../components/Common/ErrorBoundary"

export const MobileNav = observer(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const header = RootStore.Get(HeaderStore);
    return (
      <>
        <Dropdown>
          <DropdownTrigger>
            <Button className={cn("ml-auto", className)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" className="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {/* @ts-ignore */}
            {header.navs?.value?.map?.((item, index) => {
              return (
                <DropdownItem>
                  <Link
                    href={item.href ?? '/'}
                    key={index}
                    className="hover:text-primary text-sm font-medium transition-colors"
                  >
                    {item.text}
                  </Link>
                </DropdownItem>);
            })}
            <DropdownItem key="edit">
              {/* <header.UserNav /> */}
              <SlotPlugin.Slot name={HeaderStore.slots.UserNav.name} />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>

    );
  },
);
