import "reflect-metadata";
import { ClassType } from "./interface";

export const FIELD_KEY = Symbol("aiem_field");

export interface FieldParams {
  ttl?: number;
}

export type ContractParams<T extends any = any, K extends keyof T = keyof T> = K;

const metadataCache = new WeakMap<any, Map<any, any>>();

export class Fields {
  static hide(options: any = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "hide", options });
    };
  }

  static read(options: any = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "read", options });
    };
  }

  static write(options: any = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "write", options });
    };
  }

  static custom(func: any = {}) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "custom", func });
    };
  }

  static relation<T = any, R = any>(entity: () => ClassType<R>, options: ((e: T) => Promise<Partial<R> | Partial<R>[]>) | string) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "entity", entity, targetKey: options });
    };
  }

  static contract<T = any, R = any>(entity: () => ClassType<R>, options: ((e: T) => Promise<Partial<R> | Partial<R>[]>) | string) {
    return function (target: any, propertyKey: any, descriptor?: PropertyDescriptor) {
      Fields.setMetadata(target, propertyKey, { type: "entity", entity, targetKey: options });
    };
  }
  private static setMetadata(target: any, propertyKey: any, metadata: any) {
    let targetMetadata = metadataCache.get(target);
    if (!targetMetadata) {
      targetMetadata = new Map<any, any>();
      metadataCache.set(target, targetMetadata);
    }
    targetMetadata.set(propertyKey, metadata);
    Reflect.defineMetadata(FIELD_KEY, metadata, target, propertyKey);
  }
}

export function getFieldMetadata(target: any, propertyKey: string) {
  const targetMetadata = metadataCache.get(target);
  if (targetMetadata) {
    return targetMetadata.get(propertyKey);
  }
  return Reflect.getMetadata(FIELD_KEY, target, propertyKey);
}
