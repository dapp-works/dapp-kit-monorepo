import EventEmitter from 'events';

export abstract class EventProtocol {
  event: EventEmitter;
  abstract on(eventName: string, callback: (...args: any[]) => void): void;
  abstract emit(eventName: string, ...args: any[]): void;
}
