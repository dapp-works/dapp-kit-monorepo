import { EventEmitter } from 'events';
import { User } from 'next-auth';
import TypedEmitter from 'typed-emitter';

export class MyEmitter extends EventEmitter {
  emit(type: any, ...args: any[]) {
    super.emit('*', { type, args });
    return super.emit(type, ...args) || super.emit('', ...args);
  }
}

interface MessageEvents {
  // @ts-ignore
  '*': (agrgs: { type: string; args: [] }) => void;
  'app.ready': () => void;
  'user.ready': (user: User) => void;
}

// @ts-ignore
export const eventBus = new MyEmitter() as TypedEmitter<MessageEvents>;
