import { makeAutoObservable } from 'mobx';
import { User } from 'next-auth';
import EventEmitter from 'events';
import { Store } from './standard/base';

export class UserStore implements User, Store {
  sid = 'user';
  id: string = '';
  name?: string = '';
  email?: string = '';
  image?: string = '';
  token: string = '';

  event = new EventEmitter();

  signin() {
    this.event.emit('user:signin', this);
  }

  logout() {
    this.set({
      token: '',
      name: '',
      email: '',
      image: '',
    });
    this.event.emit('user:logout', this);
  }

  wait() {
    return new Promise<UserStore>((res, rej) => {
      if (this.id && this.token) {
        res(this);
      }

      this.event.once('user:ready', (user) => {
        res(this);
      });
    });
  }

  get isLogin() {
    return !!this.token;
  }
  
  set(args: Partial<UserStore>) {
    Object.assign(this, args);
    this.event.emit('user:ready', this);
  }

  constructor() {
    makeAutoObservable(this);
  }
}
