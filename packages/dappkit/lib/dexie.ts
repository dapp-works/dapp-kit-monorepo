import DataLoader from 'dataloader'
import { Dexie, type Table } from 'dexie'


export class DexieStorage extends Dexie {
  kv: Table<{ key: string, value: { value: any, expiration: number } }>

  constructor() {
    super("cache")
    this.version(1).stores({
      kv: 'key, value'
    })
  }
}
export const dexie = new DexieStorage()

export class DexieCache {
  kv = dexie.kv
  kv_get = new DataLoader(async (ids: string[]) => {
    const res = await this.kv.bulkGet(ids)
    return res.map(i => i?.value)
  }, { cache: false })
  kv_set = new DataLoader(async (ids: { key: string, value: any, ttl: number }[]) => {
    const now = new Date()
    await this.kv.bulkPut(ids.map(i => ({ key: i.key, value: { value: i.value, expiration: now.setTime(now.getTime() + i.ttl) } })))
    return ids
  }, { cache: false })
  options = {
    ttl: 60 * 1000,
    prefix: ''
  }

  async get(_key) {
    const key = this.options.prefix + _key;
    console.time('get ' + key);
    const res = await this.kv_get.load(key);
    console.timeEnd('get ' + key);
    const data = res?.value
    if (!data) return;
    return data?.value;
  }

  async getRaw(_key) {
    const key = this.options.prefix + _key;
    console.time('get ' + key);
    const res = await this.kv_get.load(key);
    console.timeEnd('get ' + key);
    const data = res?.value
    if (!data) return;
    return data;
  }

  async set(_key, value, options?: { ttl?: number }) {
    const key = this.options.prefix + _key;
    this.kv_set.load({ key, value, ttl: options?.ttl || this.options.ttl });

    return this;
  }

  async delete(key) {
    // return this.dataloader.load(['del', key]);
    return
  }

  async clear() { }

  async wrap<T extends (...args: any[]) => Promise<any>, U = ReturnType<T>>(key, fn: T, args?: { ttl?: number, alowStale?: boolean }): Promise<Awaited<U>> {
    let data = await this.kv_get.load(key)
    if (data?.expiration && new Date(data.expiration) <= new Date()) {
      // console.log("cache expired", key)

      if (args?.alowStale) {
        fn().then((value) => {
          this.kv_set.load({ key, value, ttl: args?.ttl || this.options.ttl })
        }).catch(err => {
          console.error(err)
        })
      } else {
        //@ts-ignore
        data = null;
      }
    }
    if (!data) {
      // console.log("miss cache", key)
      const value = await fn();
      this.kv_set.load({ key, value, ttl: args?.ttl || this.options.ttl });
      return value;
    }
    return data.value;
  }
}

export const cache = new DexieCache()

