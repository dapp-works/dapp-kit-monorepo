import { _ } from './lodash';
import { v4 as uuid } from 'uuid';
import JSONFormat from 'json-format';
import jwt from 'jsonwebtoken';

const valMap = {
  undefined: '',
  null: '',
  false: false,
};

export const helper = {
  promise: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async runAsync<T, U = Error>(promise: Promise<T>): Promise<[U | null, T | null]> {
      return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null]);
    },
  },
  object: {
    crawlObject(object, options) {
      const newObj = JSON.parse(JSON.stringify(object));
      return helper.object.crawl(newObj, options);
    },
    crawl(object, options) {
      Object.keys(object).forEach((i) => {
        if (typeof object[i] === 'object') {
          helper.object.crawl(object[i], options);
        } else {
          const handler = options[typeof object[i]];
          if (handler) {
            object[i] = handler(object[i]);
          }
        }
      });
      return object;
    },
  },
  json: {
    safeParse(val: any) {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    },
    clearUUID(val: any) {
      try {
        return JSON.parse(JSON.stringify(val).replace(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/g, uuid()));
      } catch (e) {
        return val;
      }
    },
  },
  deepAssign(target, ...sources) {
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        let descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor && descriptor?.get) {
          return Object.defineProperty(target, key, descriptor);
        }
        const targetValue = target[key];
        let sourceValue = source[key];
        if (helper.isObject(targetValue) && helper.isObject(sourceValue)) {
          try {
            target[key] = helper.deepAssign(targetValue, sourceValue);
          } catch (e) {
            target[key] = Object.assign(targetValue, sourceValue);
          }
        } else {
          target[key] = sourceValue;
        }
      });
    });
    return target;
  },
  isObject(value) {
    return value != null && typeof value === 'object';
  },
  deepMerge(obj, newObj) {
    const newVal = _.mergeWith(obj, newObj, (...args) => {
      const [objValue, srcValue] = args;
      if (typeof srcValue === 'object') {
        return helper.deepMerge(objValue, srcValue);
      }
      return srcValue || valMap[srcValue];
    });
    return newVal;
  },
  download: {
    downloadByBlob(name: string, blob: Blob) {
      const a = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      a.href = href;
      a.download = name;
      a.click();
    },
    downloadJSON(name: string, jsonObj: object) {
      try {
        const jsonStr: string = JSONFormat(jsonObj);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        this.downloadByBlob(name + '.json', blob);
      } catch (error) {
        console.error(error);
      }
    },
  },
  encode: async (jwtClaims: { sub: string; name: string; iat: number; exp: number }) => {
    return jwt.sign(jwtClaims, process.env.JWT_SECRET, { algorithm: 'HS256' });
  },
  decode: async (token: string): Promise<{ sub: string; name: string; iat: number; exp: number }> => {
    //@ts-ignore
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  },
};
