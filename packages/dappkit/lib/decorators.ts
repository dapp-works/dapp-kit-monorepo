import 'reflect-metadata';
import { ClassType } from './interface';

export const FIELD_KEY = Symbol('aiem_field');



export interface FieldParams {
  ttl?: number
}


export type ContractParams<T extends any = any, K extends keyof T = keyof T> = K



export class Fields {
  static read(options: FieldParams = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Reflect.defineMetadata(FIELD_KEY, { type: 'read', options }, target, propertyKey);
    };
  }
  static write(options: FieldParams = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Reflect.defineMetadata(FIELD_KEY, { type: 'write', options }, target, propertyKey);
    };
  }

  static custom(options: FieldParams = {}) {
    return function (target: (...args: any[]) => Promise<any>, propertyKey: any, descriptor?: PropertyDescriptor) {
      Reflect.defineMetadata(FIELD_KEY, { type: 'custom', options }, target, propertyKey);
    };
  }

  static contract<T = any, R = any>(entity: () => ClassType<R>, options: ContractParams<T>) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Reflect.defineMetadata(FIELD_KEY, { type: 'contract', entity, targetKey: options }, target, propertyKey);
    };
  }
}

export function getFieldMetadata(target: any, propertyKey: string) {
  return Reflect.getMetadata(FIELD_KEY, target, propertyKey);
}