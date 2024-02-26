import React from "react";

import { DesktopNav } from "../../components/Layout/DesktopNav";
import { Logo } from "../../components/Layout/Logo";
import { MobileNav } from "../../components/Layout/MobileNav";
import Nav from "../../components/Layout/Nav";
import { UserNav } from "../../components/Layout/UserNav";
import { Store } from "../../store/standard/base";
import { RootStore } from "../../store";
import { StoragePlugin } from "../Core/Storage";

export class HeaderStore implements Store {
  sid = "HeaderStore";
  autoAsyncable?: boolean = true;
  autoObservable?: boolean = true;

  get Header() {
    return Nav;
  }

  navs = StoragePlugin.Get<{ text: string, href: string }[]>({
    key: "Nav",
    defaultValue: [],
    engine: StoragePlugin.engines.asyncStorage
  })

  set(args: Partial<HeaderStore>) {
    Object.assign(this, args);
  }

  jsonForm = {};

  jsonview = {
    nav: {},
  };

  slots = {
    Logo: {
      name: "Logo",
      render: (props) => <Logo {...props} />,
    },
    DesktopNav: {
      name: "DesktopNav",
      render: (props) => <DesktopNav {...props} />,
    },
    MobileNav: {
      name: "MobileNav",
      render: (props) => <MobileNav {...props} />,
    },
    UserNav: {
      name: "UserNav",
      render: (props) => <UserNav {...props} />,
    }
  };

  static get slots() {
    return RootStore.Get(HeaderStore).slots;
  }

  constructor(args: Partial<HeaderStore> = {}) {
    Object.assign(this, args);
  }
}
