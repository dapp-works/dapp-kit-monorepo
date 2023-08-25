"use client";
import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { cn } from "../../lib/utils";
import { NavStore } from "../../module/Layout/nav";
import { rootStore } from "../../store";
import RootStore from "../../store/root";
import { UserStore } from "../../store/user";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar } from "@nextui-org/react";
import { StoragePlugin } from "../../module/Core/Storage";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";

export const UserNav = observer(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const user = RootStore.Get(UserStore);
    const nav = StoragePlugin.Get<{ text: string, href: string, clickEvent: string }[]>({
      key: "UserNavs",
      defaultValue: [
        {
          text: "Profile",
          href: "/profile",
          clickEvent: "userNavs.click"
        },
        {
          text: "Settings",
          href: "/settings",
          clickEvent: "settings.click"
        },
      ],
      engine: StoragePlugin.engines.asyncStorage
    })

    if (!user.isLogin) {
      return (
        <Button
          variant="ghost"
          className={cn("ml-auto", className)}
          onClick={(e) => {
            rootStore.events.emit("next.signIn.github");
          }}
        >
          Login
        </Button>
      );
    }
    return (
      <>
        <Dropdown>
          <DropdownTrigger>
            <Avatar className={cn("cursor-pointer h-8 w-8 ml-auto", className)} src={user?.image} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownItem>

            {/* @ts-ignore  */}
            {nav?.value?.map((i) => {
              return (
                <DropdownItem key={i.text} onClick={() => {
                  //@ts-ignore
                  i.clickEvent && rootStore.events.emit(i.clickEvent)
                }}>
                  {i.href ? <Link href={i.href ?? '/'}>{i.text}</Link> : i.text}
                </DropdownItem>
              );
            })}

            <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => user.logout()}>
              Log out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>

    );
  },
);
