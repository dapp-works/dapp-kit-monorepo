import React from "react";

import { DesktopNav } from "../../components/Layout/DesktopNav";
import { Logo } from "../../components/Layout/Logo";
import { MobileNav } from "../../components/Layout/MobileNav";
import Nav from "../../components/Layout/Nav";
import { UserNav } from "../../components/Layout/UserNav";
import { Store } from "../../store/standard/base";
import { PromiseState } from "../../store/standard/PromiseState";
import { RootStore } from "../../store";

export class HeaderStore implements Store {
  sid = "HeaderStore";
  autoAsyncable?: boolean = true;
  autoObservable?: boolean = true;

  get Header() {
    return Nav;
  }

  Logo = (props) => {
    return <Logo {...props} />;
  };

  DesktopNav = (props) => {
    return <DesktopNav {...props} />;
  };

  MobileNav = (props) => {
    return <MobileNav {...props} />;
  };

  UserNav = (props) => {
    return <UserNav {...props} />;
  };

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
      input: {},
      render: (props) => <Logo {...props} />,
    },
    DesktopNav: {
      name: "DesktopNav",
      input: {},
      render: (props) => <DesktopNav {...props} />,
    },
    MobileNav: {
      name: "MobileNav",
      input: {},
      render: (props) => <MobileNav {...props} />,
    },
  };

  static get slots() {
    return RootStore.Get(HeaderStore).slots;
  }

  test = new PromiseState({
    debug: {
      name: "test",
      input: { username: "", password: "" },
    },
    function: async (input: { username: string; password: string }) => {
      console.log(input);
    },
  });
  test1 = new PromiseState({
    debug: {
      name: "test1",
      input: { username: "", password: "" },
    },
    function: async (input: { username: string; password: string }) => {
      console.log(input);
    },
  });

  constructor(args: Partial<HeaderStore> = {}) {
    Object.assign(this, args);
  }
}
