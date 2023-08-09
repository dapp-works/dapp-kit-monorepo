"use client";
import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { cn } from "../../lib/utils";
import { NavStore } from "../../module/Layout/nav";
import { rootStore } from "../../store";
import RootStore from "../../store/root";
import { UserStore } from "../../store/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const UserNav = observer(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const user = RootStore.Get(UserStore);
    const nav = RootStore.Get(NavStore);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative ml-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {nav.userNavs.map((i) => {
              return (
                <DropdownMenuItem key={i.text} onClick={i.onClick}>
                  {i.href ? <Link href={i.href}>{i.text}</Link> : i.text}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={()=>user.logout()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
