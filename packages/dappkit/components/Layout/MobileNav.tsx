"use client";
import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { cn } from "../../lib/utils";
import { HeaderStore } from "../../module/Layout/header";
import { NavStore } from "../../module/Layout/nav";
import RootStore from "../../store/root";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const MobileNav = observer(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const nav = RootStore.Get(NavStore);
    const header = RootStore.Get(HeaderStore);
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={cn("ml-auto",className)}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M8 2H13.5C13.7761 2 14 2.22386 14 2.5V12.5C14 12.7761 13.7761 13 13.5 13H8V2ZM7 2H1.5C1.22386 2 1 2.22386 1 2.5V12.5C1 12.7761 1.22386 13 1.5 13H7V2ZM0 2.5C0 1.67157 0.671573 1 1.5 1H13.5C14.3284 1 15 1.67157 15 2.5V12.5C15 13.3284 14.3284 14 13.5 14H1.5C0.671573 14 0 13.3284 0 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            {nav?.navs?.map((item, index) => {
            return (
              <DropdownMenuItem>
                <Link
                  href={item.href}
                  key={index}
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  {item.text}
                </Link>
              </DropdownMenuItem>);
          })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <header.UserNav/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    );
  },
);
