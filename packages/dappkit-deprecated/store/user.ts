import { makeAutoObservable } from "mobx";
import { type User } from "next-auth";
import EventEmitter from "events";
import { Store } from "./standard/base";
import { rootStore } from ".";
import axios from "axios";
import { useEffect } from "react";

export class UserStore implements User, Store {
  sid = "user";
  id: string = "";
  name?: string = "";
  email?: string = "";
  image?: string = "";
  token: string = "";

  event = new EventEmitter();

  signin() {
    this.event.emit("user:signin", this);
  }

  logout() {
    this.set({
      token: "",
      name: "",
      email: "",
      image: "",
    });
    this.event.emit("user:logout", this);
  }

  wait() {
    return new Promise<UserStore>((res, rej) => {
      if (this.id && this.token) {
        res(this);
      }

      this.event.once("user:ready", (user) => {
        res(this);
      });
    });
  }

  get isLogin() {
    return !!this.token;
  }

  set(args: Partial<UserStore>) {
    Object.assign(this, args);
    this.event.emit("user:ready", this);
  }

  constructor() {
    makeAutoObservable(this);
  }

  use() {
    useEffect(() => {
      const userStore = rootStore.get(UserStore);
      axios.get("/api/auth/session").then((res) => {
        // console.log(res.data.user,'res')
        if (!userStore.isLogin && res?.data?.user) {
          this.set(res.data.user);
        }
      });
    }, []);
  }
}
