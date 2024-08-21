import { type Chain, type GetContractReturnType, type Abi, type PublicClient, type HttpTransport, type WalletClient, type Transport, type Account, encodeFunctionData, http, getContract, createPublicClient } from "viem";
import { iotex, mainnet, bsc, polygon, iotexTestnet } from "viem/chains";
import TTLCache from "@isaacs/ttlcache";
import { ClassType } from "./lib/interface";
import { getFieldMetadata } from "./lib/decorators";
import { helper } from "./utils";
import BigNumber from "bignumber.js";

//@ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};


iotexTestnet.contracts = {
  multicall3: {
    address: '0xb5cecd6894c6f473ec726a176f1512399a2e355d',
    blockCreated: 24347592,
  },
},


  //@ts-ignore
  mainnet.rpcUrls.default.http = ["https://rpc.ankr.com/eth"];
//@ts-ignore
mainnet.rpcUrls.default.webSocket = ["wss://ethereum-rpc.publicnode.com"];

export { Fields } from "./lib/decorators";

export class Cache {
  kv = new TTLCache<string, any>({ max: 10000, ttl: 1000 * 60 });

  wrap<T>(key: string, fn: () => T | Promise<T>, config: TTLCache.Options<any, any> = {}): T | Promise<T> {
    if (this.kv.has(key)) {
      // console.log(`load ${key} from cache`)
      return this.kv.get(key);
    }

    const result = fn();
    if (result instanceof Promise) {
      const promiseResult = result.then((res) => {
        this.kv.set(key, res, config);
        return res;
      });
      this.kv.set(key, promiseResult, config);
      return promiseResult;
    } else {
      this.kv.set(key, result, config);
      return result;
    }
  }
}

export type GetOptions = {
  multicall?: boolean
}

export class AIem<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }> {
  static cache?: Cache = new Cache();
  cache?: Cache = new Cache();
  contractMap?: Contracts;
  //@ts-ignore
  chainMap?: Chains = {
    [iotex.id]: iotex,
    [mainnet.id]: mainnet,
    [bsc.id]: bsc,
    [polygon.id]: polygon,
    [iotexTestnet.id]: iotexTestnet,
  };
  nameMap?: Addrs;
  contracts: {
    [K in keyof Addrs & keyof Contracts]: {
      //@ts-ignore
      [KK in keyof Addrs[K]]: GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>, any, any>;
    };
  };
  static defaultFuncMap = {
    totalSupply: { ttl: 15 * 1000 },
    symbol: { ttl: 60 * 1000 },
    name: { ttl: 60 * 1000 },
    decimals: { ttl: 60 * 1000 },
    balanceOf: { ttl: 5 * 1000 },
  };
  funcMap?: { [key: string]: { ttl?: number } } = {};

  get _cache() {
    return AIem.cache;
  }

  //@ts-ignore
  getWallet?: () => WalletClient;

  static Set<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }>(
    args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap">,
  ) {
    return this.init().Set(args);
  }

  Set<Contracts extends Record<string, Abi>, Chains extends Record<string, Chain>, Addrs extends { [K in keyof Contracts]?: { [key: string]: `${string}-0x${string}` } }>(
    args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap">,
  ): AIem<Contracts, Chains, Addrs> {
    const { chainMap = {}, contractMap = {}, funcMap, ...rest } = args || {};
    //@ts-ignore
    this.chainMap = Object.assign({}, this.chainMap || {}, chainMap);
    //@ts-ignore
    this.contractMap = Object.assign({}, this.contractMap || {}, contractMap);
    //@ts-ignore
    this.funcMap = Object.assign({}, this.funcMap || {}, funcMap);

    Object.assign(this, rest);
    return this as any;
  }

  constructor(args: Pick<AIem<Contracts, Chains, Addrs>, "contractMap" | "chainMap" | "nameMap" | "getWallet" | "cache" | "funcMap"> = {}) {
    this.Set(args);

    this.contracts = new Proxy(
      {},
      {
        //@ts-ignore
        get: (target: any, contractName: keyof Addrs & keyof Contracts) => {
          if (target[contractName]) return target[contractName];

          if (!this.nameMap[contractName]) {
            throw new Error(`Contract ${String(contractName)} not found`);
          }

          target[contractName] = new Proxy(
            {},
            {
              //@ts-ignore
              get: (innerTarget: any, contractAlias: keyof Addrs[keyof Addrs]) => {
                const addressStr = this.nameMap[contractName]?.[contractAlias];
                if (!addressStr) {
                  throw new Error(`Alias ${String(contractAlias)} for contract ${String(contractName)} not found`);
                }
                const [chainId, address] = addressStr.split("-");

                // Assuming getContractInstance is a function that retrieves a contract instance
                return this.Get(contractName, String(chainId), address as `0x${string}`);
              },
            },
          );
          return target[contractName];
        },
      },
    ) as any;
  }

  // WsClient<C extends keyof Chains>(chainId: C): PublicClient<WebSocketTransport, Chain, any, any> {
  //     //@ts-ignore
  //     return this.cache.wrap(`wsClient-${String(chainId)}`, () => {
  //         // const wsUrl = this.chainMap[chainId]?.rpcUrls?.default?.webSocket?.[0]
  //         // if (!wsUrl) throw new Error(`rpcUrls.default.webSocket[0] is not defined for chainId ${String(chainId)}`)
  //         // //@ts-ignore
  //         return createPublicClient({
  //             //@ts-ignore
  //             chain: this.chainMap[chainId],
  //             transport: webSocket()
  //         }) as PublicClient<WebSocketTransport, Chain, any, any>
  //     })
  // }

  static PubClient(chainId: string): PublicClient<HttpTransport, Chain, any, any> {
    //@ts-ignore
    return this.init().PubClient(chainId)
  }

  PubClient<C extends keyof Chains>(chainId: C, options: GetOptions = { multicall: true }): PublicClient<HttpTransport, Chain, any, any> {
    //@ts-ignore
    return this._cache.wrap(`publicClient-${String(chainId)}-${options?.multicall}`, () => {
      //@ts-ignore
      return createPublicClient({
        //@ts-ignore
        chain: this.chainMap[chainId],

        ...(options?.multicall ? {
          batch: {
            multicall: true
          },
        } : {}),

        //@ts-ignore
        transport: http(),
      })
    });
  }

  //@ts-ignore
  Get<K extends keyof Contracts, C extends keyof Chains, Addr extends `0x${string}`>(
    contractName: K,
    chainId: C,
    address: Addr,
    options: GetOptions = { multicall: true }
    //@ts-ignore
  ): GetContractReturnType<Contracts[K], PublicClient<HttpTransport, Chain, any, any>> & { encode: GetContractReturnType<Contracts[K], WalletClient<HttpTransport, Chain, Account, any>>["write"] } {
    const wallet = this.getWallet ? this.getWallet() : null;
    //@ts-ignore
    const cacheKey = `contract ${chainId}-${address}-${wallet ? wallet.account.address : null}`;
    return this._cache.wrap(cacheKey, () => {
      //@ts-ignore
      const contract = this.contractMap[contractName];
      //@ts-ignore
      const pubClient = this.PubClient(chainId, options);

      //@ts-ignore
      return this.getContract({
        client: {
          //@ts-ignore
          public: pubClient,
          //@ts-ignore
          wallet,
        },
        address,
        abi: contract,
      });
    }) as any;
  }

  getContract({
    client,
    address,
    abi,
  }: {
    client: {
      public: PublicClient<HttpTransport, Chain, any, any>;
      wallet?: WalletClient;
    };
    address: `0x${string}`;
    abi: any;
  }) {
    const handler = {
      get: (target: any, funcName: any) => {
        if (funcName == 'encode') {
          return new Proxy({}, {
            get(t1, f1) {
              return async (args: any) => {
                return encodeFunctionData({
                  abi,
                  functionName: f1,
                  args
                })
              }
            }
          });
        }

        if (typeof target[funcName] === "function") {
          return async (...args: any[]) => {
            const methodConfig = this.funcMap?.[funcName as string];
            // const cacheKey = `method:${client.public.chain.id}-${address}-${String(funcName)}-${JSON.stringify(args)}`;
            const cacheKey = `call ${client.public.chain.id}-${address}-${funcName}-${JSON.stringify(args)}`;

            if (methodConfig) {
              return this.cache.wrap(
                cacheKey,
                () => {
                  return target[funcName](...args);
                },
                methodConfig,
              );
            }

            return target[funcName](...args);
          };
        }
        return new Proxy(target[funcName], handler);
      },
    };

    //@ts-ignore
    const contract = getContract({
      //@ts-ignore
      client,
      address,
      abi,
    });
    return new Proxy(contract, handler) as any;
  }

  static init(): AIem<any, any, any> {
    if (!globalThis.aiem) {
      //@ts-ignore
      globalThis.aiem = new AIem();
    }

    return globalThis.aiem;
  }

  //@ts-ignore
  static Get<TAbi extends Abi = any, ReturnType extends GetContractReturnType<TAbi, WalletClient<Transport, Chain, Account>>>(abi: TAbi, chainId: any, address: any, wallet?: WalletClient, options?: GetOptions = { multicall: true }): ReturnType & { encode: ReturnType["write"] } {
    const aiem = this.init();

    const cacheKey = `contract ${chainId}-${address}-${wallet ? wallet.account.address : null}`;
    return aiem._cache.wrap(cacheKey, () => {
      //@ts-ignore
      const pubClient = aiem.PubClient(chainId, options);

      //@ts-ignore
      return aiem.getContract({
        client: {
          //@ts-ignore
          public: pubClient,
          //@ts-ignore
          wallet,
        },
        address,
        abi,
      });
    }) as any;
  }

  static async getPrice({ chainId = "4689", address }: { chainId?: string; address: string }) {
    const priceMap = await this.cache.wrap(
      `token-price`,
      async () => {
        const res = await (await fetch("https://api.iopay.me/api/rest/price")).json();
        return Object.values(res)
          .flat()
          .reduce((p, c: { platforms: string; current_price: number }) => {
            p[`${4689}-${c.platforms.toLowerCase()}`] = c.current_price;
            return p;
          }, {});
      },
      { ttl: 1000 * 60 },
    );
    return priceMap[`${chainId}-${address}`];
  }

  static utils = {
    autoFormat: async ({ value, decimals, chainId, address }: { value: string; decimals: number; chainId: string; address: string }) => {
      const wrap = helper.number.warpBigNumber(value, decimals, { format: "0,0.000000", fallback: "" });
      const price = await this.getPrice({ chainId, address: address.toLowerCase() });
      const usd = new BigNumber(wrap.originFormat).multipliedBy(price || 1).toFixed(2);
      return { ...wrap, usd };
    },
  };

  static QueryMany<E, S extends QuerySelect<E>>(entity: ClassType<E>, select: S) {
    return async (_entities: Partial<E>[]): Promise<QueryReturnType<E, S>[]> => {
      //@ts-ignore
      return this.Query(entity, select)(_entities) as any;
    };
  }

  static Query<E, S extends QuerySelect<E>>(entity: ClassType<E>, select: S) {
    return async (entities: Partial<E>): Promise<QueryReturnType<E, S>> => {
      const results: Array<QueryReturnType<E, S>> = [];
      const isArrayInput = Array.isArray(entities);

      if (!isArrayInput) {
        //@ts-ignore
        entities = [entities];
      }
      //@ts-ignore
      for (const entityData of entities) {
        const instance = Object.assign(new entity(), entityData);
        // const result: any = {};

        const fetchFields = async (obj: any, sel: any) => {
          const promises = [];
          for (const key in sel) {

            // return console.log(key, getFieldMetadata(obj, key))
            // Check if the property is annotated with @Fields.read(), @Fields.custom(), or @Fields.contract()
            const fieldMetadata = getFieldMetadata(obj, key);
            let call: any;
            //@ts-ignore
            const enableMulticall = entity.multicall == false ? false : true
            // console.log(key, fieldMetadata, instance)
            if (sel[key] == false) {
              call = async () => null
            } else if (fieldMetadata) {
              switch (fieldMetadata.type) {
                case "read":
                  if (Array.isArray(sel[key])) {
                    //@ts-ignore
                    call = () => this.Get(entity.abi, instance.chainId, instance.address, null, { multicall: enableMulticall }).read[key](sel[key]);
                  } else {
                    //@ts-ignore
                    call = () => this.Get(entity.abi, instance.chainId, instance.address, null, { multicall: enableMulticall }).read[key]();
                  }
                  break;
                case "write":
                  obj[key] = encodeFunctionData({
                    //@ts-ignore
                    abi: entity.abi,
                    functionName: key,
                    args: sel[key],
                  });

                  break;
                case "custom":
                  call = () => obj[key](...(Array.isArray(sel[key]) ? sel[key] : []));
                  break;
                case "contract":
                  const targetMetadata = getFieldMetadata(instance, fieldMetadata.targetKey);

                  if (typeof fieldMetadata.targetKey == 'string') {

                    if (targetMetadata?.options?.ttl) {
                      //@ts-ignore
                      const cacheKey = `call ${instance.chainId}-${instance.address}-${fieldMetadata.targetKey}`;
                      //@ts-ignore
                      call = () =>
                        new Promise(async (resolve) => {
                          //@ts-ignore
                          const address = await this.cache.wrap(cacheKey, async () => this.Get(entity.abi, instance.chainId, instance.address, null, { multicall: enableMulticall }).read[fieldMetadata.targetKey]());
                          //@ts-ignore
                          resolve(this.Query(fieldMetadata.entity(), sel[key])({ address, chainId: instance.chainId }));
                        });
                    } else {
                      call = () =>
                        //@ts-ignore
                        this.Get(entity.abi, instance.chainId, instance.address, null, { multicall: enableMulticall })
                          //@ts-ignore
                          .read[fieldMetadata.targetKey]()
                          .then((address: any) => {
                            // console.log({ address, sel: sel[key] })
                            //@ts-ignore
                            return this.Query(fieldMetadata.entity(), sel[key])({ address, chainId: instance.chainId });
                          });
                    }
                  } else {
                    //@ts-ignore
                    call = () => fieldMetadata.targetKey(instance).then((args) => {
                      // console.log(args)
                      return Array.isArray(args) ? this.QueryMany(fieldMetadata.entity(), sel[key])(args) : this.Query(fieldMetadata.entity(), sel[key])(args)
                    })
                  }
                  break;
                default:
                  break;
              }
            }

            if (call) {
              if (fieldMetadata?.options?.ttl) {
                //@ts-ignore
                const cacheKey = `call ${instance.chainId}-${instance.address}-${key}-${JSON.stringify(sel[key])}`;
                promises.push(
                  new Promise(async (resolve) => {
                    const value = await this.cache.wrap(cacheKey, async () => call(), fieldMetadata.options);
                    obj[key] = value;
                    resolve(value);
                  }),
                );
              } else {
                promises.push(
                  call().then((value) => {
                    obj[key] = value;
                  }),
                );
              }
            }
          }

          await Promise.all(promises);
        };

        await fetchFields(instance, select);
        //@ts-ignore
        results.push(instance);
      }

      if (isArrayInput) {
        return results as any
      } else {
        return results[0] as any
      }
    };
  }
}
export type Item<T> = T extends (infer U)[] ? U : T;

// export type QueryResult<E, S extends QuerySelect<E>> =
//   E extends Array<any> ? Promise<Array<QueryReturnType<E[number], S>>> :
//   E extends object ? Promise<QueryReturnType<E, S>> :
//   never;

type QuerySelect<E> = {
  [K in keyof E]?: E[K] extends (...args: any[]) => any ? Parameters<E[K]> | boolean : E[K] extends object ? QuerySelect<Item<E[K]>> : boolean;
};

// type FunctionReturn<T> = T extends (...args: any[]) => any ? Awaited<ReturnType<T>> : T;
// type NestedReturn<E, S> = E extends object ? S extends object ? QueryReturnType<E, S> : E : E;

export type QueryReturnType<E, S extends QuerySelect<E>> = {
  [K in keyof E]: K extends keyof S
  ? E[K] extends (...args: any[]) => any
  ? Awaited<ReturnType<E[K]>>
  : E[K] extends object
  ? S[K] extends object
  ? QueryReturnType<E[K], S[K]>
  : E[K]
  : E[K]
  : E[K];
};
